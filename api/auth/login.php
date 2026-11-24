<?php
// api/auth/login.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

list($method, $data) = getRequestData();

if ($method !== 'POST') {
    jsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($email) || empty($password)) {
    jsonResponse([
        "success" => false,
        "message" => "Email and password are required."
    ], 400);
}

$stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password'])) {
    jsonResponse([
        "success" => false,
        "message" => "Invalid email or password."
    ], 401);
}

if ($admin['status'] !== 'active') {
    jsonResponse([
        "success" => false,
        "message" => "Your account is deactivated."
    ], 403);
}

// Generate secure token
$token = bin2hex(random_bytes(32));
$updateStmt = $pdo->prepare("UPDATE admins SET token = ? WHERE id = ?");
$updateStmt->execute([$token, $admin['id']]);

unset($admin['password']);
$admin['token'] = $token;

jsonResponse([
    "success" => true,
    "message" => "Login successful.",
    "token" => $token,
    "admin" => $admin
]);
