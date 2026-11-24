<?php
// api/auth/me.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

$admin = authenticateAdmin($pdo);

jsonResponse([
    "success" => true,
    "admin" => $admin
]);
