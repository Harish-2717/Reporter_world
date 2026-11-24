<?php
// api/logo/index.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

list($method, $data) = getRequestData();

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT logo, is_logo_active, company_name, tagline FROM company_settings WHERE id = 1 LIMIT 1");
        $logoData = $stmt->fetch();

        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $baseUploadUrl = $protocol . $host . "/Reporter%20World/api/uploads/";

        $logoUrl = null;
        if (!empty($logoData['logo'])) {
            $logoUrl = (strpos($logoData['logo'], 'http') === 0) ? $logoData['logo'] : $baseUploadUrl . $logoData['logo'];
        }

        jsonResponse([
            "success" => true,
            "logo" => $logoData['logo'] ?? null,
            "logo_url" => $logoUrl,
            "is_logo_active" => (bool)($logoData['is_logo_active'] ?? 1),
            "company_name" => $logoData['company_name'] ?? 'Reporter World',
            "tagline" => $logoData['tagline'] ?? 'Voice of the World | Real-time Global News'
        ]);
        break;

    case 'POST':
        $admin = authenticateAdmin($pdo);

        // Check if toggling status or uploading new file
        $action = $data['action'] ?? 'upload';

        if ($action === 'toggle_status') {
            $isActive = !empty($data['is_logo_active']) ? 1 : 0;
            $stmt = $pdo->prepare("UPDATE company_settings SET is_logo_active = ? WHERE id = 1");
            $stmt->execute([$isActive]);

            jsonResponse([
                "success" => true,
                "message" => "Logo status updated successfully.",
                "is_logo_active" => (bool)$isActive
            ]);
        }

        // Upload or replace logo file
        $uploadedLogo = handleUploadedImage('logo');
        if (!$uploadedLogo && !empty($data['logo_url'])) {
            $uploadedLogo = $data['logo_url'];
        }

        if (!$uploadedLogo) {
            jsonResponse([
                "success" => false,
                "message" => "No logo image file was uploaded."
            ], 400);
        }

        $stmt = $pdo->prepare("UPDATE company_settings SET logo = ?, is_logo_active = 1 WHERE id = 1");
        $stmt->execute([$uploadedLogo]);

        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $logoUrl = (strpos($uploadedLogo, 'http') === 0) ? $uploadedLogo : $protocol . $host . "/Reporter%20World/api/uploads/" . $uploadedLogo;

        jsonResponse([
            "success" => true,
            "message" => "Logo updated successfully.",
            "logo" => $uploadedLogo,
            "logo_url" => $logoUrl
        ]);
        break;

    default:
        jsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}
