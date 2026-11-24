<?php
// api/config/cors.php

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper to return standardized JSON responses
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Helper to parse input (supports JSON, FormData, or raw input)
function getRequestData() {
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Check if method override is present
    if (isset($_POST['_method'])) {
        $method = strtoupper($_POST['_method']);
    } elseif (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
        $method = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']);
    }

    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?? [];
        return [$method, $data];
    }
    
    // Fallback to $_POST
    if (!empty($_POST)) {
        return [$method, $_POST];
    }
    
    // Fallback for PUT/DELETE with raw urlencoded or json
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $jsonData = json_decode($raw, true);
        if ($jsonData !== null) {
            return [$method, $jsonData];
        }
        parse_str($raw, $parsed);
        return [$method, $parsed ?? []];
    }
    
    return [$method, []];
}

// Helper to get bearer token from request headers
function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

// Helper to authenticate admin token
function authenticateAdmin($pdo) {
    $token = getBearerToken();
    if (!$token) {
        jsonResponse([
            "success" => false,
            "message" => "Unauthorized. Please log in."
        ], 401);
    }

    $stmt = $pdo->prepare("SELECT id, name, email, status FROM admins WHERE token = ? AND status = 'active' LIMIT 1");
    $stmt->execute([$token]);
    $admin = $stmt->fetch();

    if (!$admin) {
        jsonResponse([
            "success" => false,
            "message" => "Invalid or expired token."
        ], 401);
    }

    return $admin;
}

// Helper to handle image uploads safely
function handleUploadedImage($fileKey, $targetSubDir = '') {
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $file = $_FILES[$fileKey];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
    $maxSize = 10 * 1024 * 1024; // 10MB

    if ($file['size'] > $maxSize) {
        jsonResponse([
            "success" => false,
            "message" => "File size exceeds 10MB limit."
        ], 400);
    }

    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    // Allow svg if extension matches or mime matches
    $isValidMime = in_array($mimeType, $allowedTypes) || ($extension === 'svg' && strpos($mimeType, 'text') !== false);
    if (!in_array($extension, $allowedExtensions) || !$isValidMime) {
        jsonResponse([
            "success" => false,
            "message" => "Only valid image formats (JPG, JPEG, PNG, WEBP, SVG) are allowed."
        ], 400);
    }

    $uploadBaseDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadBaseDir)) {
        mkdir($uploadBaseDir, 0777, true);
    }

    $filename = time() . '_' . bin2hex(random_bytes(6)) . '.' . $extension;
    $destination = $uploadBaseDir . '/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return $filename;
    }

    jsonResponse([
        "success" => false,
        "message" => "Failed to save uploaded file."
    ], 500);
}

// Helper to create URL-friendly slug
function createSlug($string) {
    // Replace non letter or digits by -
    $text = preg_replace('~[^\pL\d]+~u', '-', $string);
    // Trim
    $text = trim($text, '-');
    // Remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);
    // Lowercase
    $text = strtolower($text);
    if (empty($text)) {
        return 'news-' . time();
    }
    return $text;
}
