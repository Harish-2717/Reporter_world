<?php
// api/settings/index.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

list($method, $data) = getRequestData();

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM company_settings WHERE id = 1 LIMIT 1");
        $settings = $stmt->fetch();

        if (!$settings) {
            // Default settings if empty
            $settings = [
                "id" => 1,
                "company_name" => "Reporter World",
                "tagline" => "Voice of the World | Real-time Global News",
                "logo" => "logo.svg",
                "is_logo_active" => 1,
                "phone" => "+1 (555) 019-2834",
                "email" => "contact@reporterworld.com",
                "address" => "Headquarters, World News Center, Suite 400, New York, NY 10001",
                "facebook" => "https://facebook.com/reporterworld",
                "instagram" => "https://instagram.com/reporterworld",
                "youtube" => "https://youtube.com/@reporterworld",
                "twitter" => "https://twitter.com/reporterworld",
                "footer_text" => "Reporter World – Real-time, accurate, and unbiased journalism covering politics, entertainment, sports, global affairs, and breaking updates from around the globe.",
                "copyright_text" => "© 2026 Reporter World. All rights reserved."
            ];
        }

        // Add base URL for uploads
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $baseUploadUrl = $protocol . $host . "/Reporter%20World/api/uploads/";
        $settings['upload_base_url'] = $baseUploadUrl;

        jsonResponse([
            "success" => true,
            "settings" => $settings
        ]);
        break;

    case 'POST':
    case 'PUT':
        $admin = authenticateAdmin($pdo);

        $stmt = $pdo->query("SELECT * FROM company_settings WHERE id = 1 LIMIT 1");
        $current = $stmt->fetch();

        $companyName = trim($data['company_name'] ?? $current['company_name'] ?? 'Reporter World');
        $tagline = trim($data['tagline'] ?? $current['tagline'] ?? 'Voice of the World | Real-time Global News');
        $taglineTa = isset($data['tagline_ta']) ? trim($data['tagline_ta']) : ($current['tagline_ta'] ?? null);
        $phone = trim($data['phone'] ?? $current['phone'] ?? '');
        $email = trim($data['email'] ?? $current['email'] ?? '');
        $address = trim($data['address'] ?? $current['address'] ?? '');
        $addressTa = isset($data['address_ta']) ? trim($data['address_ta']) : ($current['address_ta'] ?? null);
        $facebook = trim($data['facebook'] ?? $current['facebook'] ?? '');
        $instagram = trim($data['instagram'] ?? $current['instagram'] ?? '');
        $youtube = trim($data['youtube'] ?? $current['youtube'] ?? '');
        $twitter = trim($data['twitter'] ?? $current['twitter'] ?? '');
        $footerText = trim($data['footer_text'] ?? $current['footer_text'] ?? '');
        $footerTextTa = isset($data['footer_text_ta']) ? trim($data['footer_text_ta']) : ($current['footer_text_ta'] ?? null);
        $copyrightText = trim($data['copyright_text'] ?? $current['copyright_text'] ?? '');
        $copyrightTextTa = isset($data['copyright_text_ta']) ? trim($data['copyright_text_ta']) : ($current['copyright_text_ta'] ?? null);
        $isLogoActive = isset($data['is_logo_active']) ? (intval($data['is_logo_active']) ? 1 : 0) : ($current['is_logo_active'] ?? 1);

        // Upload logo if provided
        $uploadedLogo = handleUploadedImage('logo');
        if (!$uploadedLogo) {
            $uploadedLogo = $data['logo_url'] ?? $current['logo'] ?? 'logo.svg';
        }

        if ($current) {
            $sql = "UPDATE company_settings SET 
                    company_name = ?, tagline = ?, tagline_ta = ?, logo = ?, is_logo_active = ?, phone = ?, email = ?, 
                    address = ?, address_ta = ?, facebook = ?, instagram = ?, youtube = ?, twitter = ?, 
                    footer_text = ?, footer_text_ta = ?, copyright_text = ?, copyright_text_ta = ? 
                    WHERE id = 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $companyName, $tagline, $taglineTa, $uploadedLogo, $isLogoActive, $phone, $email,
                $address, $addressTa, $facebook, $instagram, $youtube, $twitter,
                $footerText, $footerTextTa, $copyrightText, $copyrightTextTa
            ]);
        } else {
            $sql = "INSERT INTO company_settings (id, company_name, tagline, tagline_ta, logo, is_logo_active, phone, email, address, address_ta, facebook, instagram, youtube, twitter, footer_text, footer_text_ta, copyright_text, copyright_text_ta) 
                    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $companyName, $tagline, $taglineTa, $uploadedLogo, $isLogoActive, $phone, $email,
                $address, $addressTa, $facebook, $instagram, $youtube, $twitter,
                $footerText, $footerTextTa, $copyrightText, $copyrightTextTa
            ]);
        }

        jsonResponse([
            "success" => true,
            "message" => "Company settings updated successfully.",
            "logo" => $uploadedLogo
        ]);
        break;

    default:
        jsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}
