<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Factory\AppFactory;
use App\Routes\ChallengeRoutes;
use App\Routes\UserRoutes;
require __DIR__ . '/../vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../'); 
$dotenv->load();



$dbUrl = parse_url($_ENV['DATABASE_URL']);

$dbHost = $dbUrl['host'];
$dbPort = $dbUrl['port'];
$dbName = ltrim($dbUrl['path'], '/');
$dbUser = $dbUrl['user'];
$dbPass = $dbUrl['pass'];

$dsn = "pgsql:host=$dbHost;port=$dbPort;dbname=$dbName";
$pdo = new PDO($dsn, $dbUser, $dbPass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

// --- Conexión a la SEGUNDA base de datos (Retos) ---
$dbChallengesUrl = parse_url($_ENV['CHALLENGES_DATABASE_URL']);
$dbChallengesHost = $dbChallengesUrl['host'];
$dbChallengesPort = $dbChallengesUrl['port'];
$dbChallengesName = ltrim($dbChallengesUrl['path'], '/');
$dbChallengesUser = $dbChallengesUrl['user'];
$dbChallengesPass = $dbChallengesUrl['pass'];

$dsnChallenges = "pgsql:host=$dbChallengesHost;port=$dbChallengesPort;dbname=$dbChallengesName";
$pdo_challenges = new PDO($dsnChallenges, $dbChallengesUser, $dbChallengesPass);
$pdo_challenges->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$app = AppFactory::create();

// Middleware para parsear el body como JSON
$app->addBodyParsingMiddleware();

// Middleware para manejar las peticiones preflight OPTIONS
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

// Middleware para añadir cabeceras CORS a todas las respuestas
$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->addRoutingMiddleware();

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("¡Hola desde el Admin Service en PHP!");
    return $response;
});

// MOdulos
$app->group('/admin', function ($group) use ($pdo, $pdo_challenges) {
    // Ruta para las estadísticas del dashboard
    $group->get('/dashboard-stats', function (Request $request, Response $response) use ($pdo, $pdo_challenges) {
        try {
            $userStmt = $pdo->query('SELECT COUNT(*) as total FROM usuario');
            $totalUsers = $userStmt->fetchColumn();

            $challengeStmt = $pdo_challenges->query('SELECT COUNT(*) as total FROM challenges');
            $totalChallenges = $challengeStmt->fetchColumn();

            $stats = ['total_users' => (int)$totalUsers, 'total_challenges' => (int)$totalChallenges];
            $response->getBody()->write(json_encode($stats));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (PDOException $e) {
            $response->getBody()->write(json_encode(['error' => 'Error al obtener las estadísticas: ' . $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    });

    // Ruta para las analíticas de registro de usuarios
    $group->get('/analytics/user-registrations', function (Request $request, Response $response) use ($pdo, $pdo_challenges) {
        try {
            // Consulta para obtener el conteo de usuarios por día en los últimos 30 días
            $query = "SELECT fecha_creacion::date as date, COUNT(id_usuario) as count 
                      FROM usuario 
                      WHERE fecha_creacion >= NOW() - INTERVAL '30 days' 
                      GROUP BY fecha_creacion::date 
                      ORDER BY date ASC";
            $stmt = $pdo->query($query);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response->getBody()->write(json_encode($data));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (PDOException $e) {
            $response->getBody()->write(json_encode(['error' => 'Error al obtener datos de analíticas: ' . $e->getMessage()]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    });
    $userRoutes = new UserRoutes();
    $userRoutes->register($group, $pdo);
    
    $challengeRoutes = new ChallengeRoutes();
    $challengeRoutes->register($group, $pdo_challenges);
});

$app->run();
