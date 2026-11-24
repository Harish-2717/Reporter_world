<?php
// api/sliders/index.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

list($method, $data) = getRequestData();

switch ($method) {
    case 'GET':
        $isAdmin = isset($_GET['admin']) && $_GET['admin'] == '1';
        $sliderId = $_GET['id'] ?? null;

        if ($sliderId) {
            $stmt = $pdo->prepare("SELECT * FROM sliders WHERE id = ?");
            $stmt->execute([$sliderId]);
            $slider = $stmt->fetch();
            if (!$slider) {
                jsonResponse(["success" => false, "message" => "Slider not found"], 404);
            }
            jsonResponse(["success" => true, "slider" => $slider]);
        }

        if ($isAdmin) {
            authenticateAdmin($pdo);
            $stmt = $pdo->query("SELECT * FROM sliders ORDER BY display_order ASC, id DESC");
        } else {
            $stmt = $pdo->query("SELECT * FROM sliders WHERE status = 'active' ORDER BY display_order ASC, id DESC");
        }

        $sliders = $stmt->fetchAll();
        jsonResponse([
            "success" => true,
            "sliders" => $sliders
        ]);
        break;

    case 'POST':
        $admin = authenticateAdmin($pdo);

        $title = trim($data['title'] ?? '');
        $titleTa = trim($data['title_ta'] ?? '');
        $description = trim($data['description'] ?? '');
        $descriptionTa = trim($data['description_ta'] ?? '');
        $buttonText = trim($data['button_text'] ?? 'Read Full Story');
        $buttonTextTa = trim($data['button_text_ta'] ?? '');
        $link = trim($data['link'] ?? '');
        $displayOrder = intval($data['display_order'] ?? 0);
        $status = in_array($data['status'] ?? '', ['active', 'inactive']) ? $data['status'] : 'active';

        if (empty($title)) {
            jsonResponse(["success" => false, "message" => "Slider title is required"], 400);
        }

        $imageName = handleUploadedImage('image');
        if (!$imageName) {
            $imageName = $data['image_url'] ?? 'default_slider.jpg';
        }

        $stmt = $pdo->prepare("INSERT INTO sliders (title, title_ta, description, description_ta, image, button_text, button_text_ta, link, display_order, status) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $titleTa, $description, $descriptionTa, $imageName, $buttonText, $buttonTextTa, $link, $displayOrder, $status]);
        $newId = $pdo->lastInsertId();

        jsonResponse([
            "success" => true,
            "message" => "Slider created successfully",
            "slider_id" => $newId
        ], 201);
        break;

    case 'PUT':
        $admin = authenticateAdmin($pdo);

        $id = intval($data['id'] ?? $_GET['id'] ?? 0);
        if ($id <= 0) {
            jsonResponse(["success" => false, "message" => "Invalid slider ID"], 400);
        }

        $stmtCurrent = $pdo->prepare("SELECT * FROM sliders WHERE id = ?");
        $stmtCurrent->execute([$id]);
        $current = $stmtCurrent->fetch();
        if (!$current) {
            jsonResponse(["success" => false, "message" => "Slider not found"], 404);
        }

        $title = isset($data['title']) ? trim($data['title']) : $current['title'];
        $titleTa = isset($data['title_ta']) ? trim($data['title_ta']) : ($current['title_ta'] ?? null);
        $description = isset($data['description']) ? trim($data['description']) : $current['description'];
        $descriptionTa = isset($data['description_ta']) ? trim($data['description_ta']) : ($current['description_ta'] ?? null);
        $buttonText = isset($data['button_text']) ? trim($data['button_text']) : $current['button_text'];
        $buttonTextTa = isset($data['button_text_ta']) ? trim($data['button_text_ta']) : ($current['button_text_ta'] ?? null);
        $link = isset($data['link']) ? trim($data['link']) : $current['link'];
        $displayOrder = isset($data['display_order']) ? intval($data['display_order']) : $current['display_order'];
        $status = isset($data['status']) && in_array($data['status'], ['active', 'inactive']) ? $data['status'] : $current['status'];

        $imageName = handleUploadedImage('image');
        if (!$imageName) {
            $imageName = $data['image_url'] ?? $current['image'];
        }

        $stmt = $pdo->prepare("UPDATE sliders SET title = ?, title_ta = ?, description = ?, description_ta = ?, image = ?, button_text = ?, button_text_ta = ?, link = ?, display_order = ?, status = ? WHERE id = ?");
        $stmt->execute([$title, $titleTa, $description, $descriptionTa, $imageName, $buttonText, $buttonTextTa, $link, $displayOrder, $status, $id]);

        jsonResponse([
            "success" => true,
            "message" => "Slider updated successfully"
        ]);
        break;

    case 'DELETE':
        $admin = authenticateAdmin($pdo);
        $id = intval($data['id'] ?? $_GET['id'] ?? 0);

        if ($id <= 0) {
            jsonResponse(["success" => false, "message" => "Invalid slider ID"], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM sliders WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse([
            "success" => true,
            "message" => "Slider deleted successfully"
        ]);
        break;

    default:
        jsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}
