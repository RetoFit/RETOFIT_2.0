<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Factory\AppFactory;
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
$userRoutes = new UserRoutes();
$userRoutes->register($app, $pdo);

$app->run();
