<?php

namespace App\Routes;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Interfaces\RouteCollectorProxyInterface;
use PDO;

class UserRoutes
{
    public function register(RouteCollectorProxyInterface $group, PDO $pdo)
    {
        // Obtener todos los usuarios y estadísticas
        $group->get('/users', function (Request $request, Response $response, $args) use ($pdo) {
            try {
                // 1. Obtener la lista de usuarios (con paginación en el futuro)
                $stmt = $pdo->query('SELECT id_usuario, nombre, correo, rol FROM usuario ORDER BY id_usuario DESC LIMIT 100'); // Limite para seguridad
                $users = $stmt->fetchAll();

                // 2. Obtener estadísticas directamente desde la base de datos (¡Mucho más rápido!)
                $totalUsersStmt = $pdo->query("SELECT COUNT(*) FROM usuario");
                $activeUsersStmt = $pdo->query("SELECT COUNT(*) FROM usuario WHERE rol <> 'suspended'");
                $suspendedUsersStmt = $pdo->query("SELECT COUNT(*) FROM usuario WHERE rol = 'suspended'");

                $stats = [
                    'total_users' => (int)$totalUsersStmt->fetchColumn(),
                    'active_users' => (int)$activeUsersStmt->fetchColumn(),
                    'suspended_users' => (int)$suspendedUsersStmt->fetchColumn(),
                ];
            } catch (PDOException $e) {
                $errorPayload = json_encode(['error' => 'Error al consultar la base de datos: ' . $e->getMessage()]);
                $response->getBody()->write($errorPayload);
                return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
            }

            $usersWithActions = array_map(function ($user) {
                $mappedUser = [
                    'id' => $user['id_usuario'],
                    'name' => $user['nombre'],
                    'email' => $user['correo'],
                    'status' => $user['rol'] === 'suspended' ? 'suspended' : 'active',
                    'last_login' => null,
                ];
                $mappedUser['_actions'] = [
                    'view_details' => "/admin/users/{$mappedUser['id']}",
                    'suspend' => $mappedUser['status'] === 'active' ? "/admin/users/{$mappedUser['id']}/suspend" : null,
                    'reactivate' => $mappedUser['status'] === 'suspended' ? "/admin/users/{$mappedUser['id']}/reactivate" : null,
                    'delete' => "/admin/users/{$mappedUser['id']}",
                ];
                return $mappedUser;
            }, $users);

            $data = ['stats' => $stats, 'users' => $usersWithActions];
            $payload = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type', 'application/json');
        });

        // Crear un nuevo usuario
        $group->post('/users', function (Request $request, Response $response, $args) use ($pdo) {
            $data = $request->getParsedBody();
            $name = $data['name'] ?? null;
            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;

            if (!$name || !$email || !$password) {
                $response->getBody()->write(json_encode(['error' => 'Nombre, email y contraseña son requeridos.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            try {
                $stmt = $pdo->prepare('INSERT INTO usuario (nombre, correo, contraseña, rol, proveedor) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$name, $email, $hashedPassword, 'user', 'local']);
            } catch (PDOException $e) {
                $response->getBody()->write(json_encode(['error' => 'No se pudo crear el usuario. El email ya podría existir.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(409);
            }

            $payload = json_encode(['message' => "Usuario '{$name}' creado con éxito."]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        });

        // Actualizar el estado de un usuario (suspender/reactivar)
        $group->patch('/users/{id}/status', function (Request $request, Response $response, $args) use ($pdo) {
            $userId = $args['id'];
            $data = $request->getParsedBody();
            $newStatus = $data['status'] ?? null;
            $newRole = ($newStatus === 'active') ? 'user' : 'suspended';

            if ($newStatus !== 'active' && $newStatus !== 'suspended') {
                $response->getBody()->write(json_encode(['error' => 'Estado no válido.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $stmt = $pdo->prepare('UPDATE usuario SET rol = ? WHERE id_usuario = ?');
            $stmt->execute([$newRole, $userId]);

            $action = $newStatus === 'active' ? 'reactivado' : 'suspendido';
            $payload = json_encode(['message' => "Usuario {$action} con éxito."]);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type', 'application/json');
        });

        // Eliminar un usuario
        $group->delete('/users/{id}', function (Request $request, Response $response, $args) use ($pdo) {
            $userId = $args['id'];
            $stmt = $pdo->prepare('DELETE FROM usuario WHERE id_usuario = ?');
            $stmt->execute([$userId]);

            if ($stmt->rowCount() === 0) {
                $response->getBody()->write(json_encode(['error' => 'Usuario no encontrado.']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $payload = json_encode(['message' => 'Usuario eliminado con éxito.']);
            $response->getBody()->write($payload);
            return $response->withHeader('Content-Type', 'application/json');
        });
    }
}
