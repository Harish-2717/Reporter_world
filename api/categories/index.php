<?php
// api/categories/index.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

list($method, $data) = getRequestData();

switch ($method) {
    case 'GET':
        $isAdmin = isset($_GET['admin']) && $_GET['admin'] == '1';
        $categoryId = $_GET['id'] ?? null;

        if ($categoryId) {
            $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
            $stmt->execute([$categoryId]);
            $category = $stmt->fetch();
            if (!$category) {
                jsonResponse(["success" => false, "message" => "Category not found"], 404);
            }
            jsonResponse(["success" => true, "category" => $category]);
        }

        if ($isAdmin) {
            authenticateAdmin($pdo);
            $query = "SELECT c.*, COUNT(n.id) as news_count 
                      FROM categories c 
                      LEFT JOIN news n ON c.id = n.category_id 
                      GROUP BY c.id 
                      ORDER BY c.display_order ASC, c.id ASC";
            $stmt = $pdo->query($query);
        } else {
            $query = "SELECT c.*, COUNT(n.id) as news_count 
                      FROM categories c 
                      LEFT JOIN news n ON c.id = n.category_id AND n.status = 'published'
                      WHERE c.status = 'active' 
                      GROUP BY c.id 
                      ORDER BY c.display_order ASC, c.id ASC";
            $stmt = $pdo->query($query);
        }

        $categories = $stmt->fetchAll();
        jsonResponse([
            "success" => true,
            "categories" => $categories
        ]);
        break;

    case 'POST':
        $admin = authenticateAdmin($pdo);
        $name = trim($data['name'] ?? '');
        $nameTa = trim($data['name_ta'] ?? '');
        $slug = trim($data['slug'] ?? '');
        $status = in_array($data['status'] ?? '', ['active', 'inactive']) ? $data['status'] : 'active';
        $displayOrder = intval($data['display_order'] ?? 0);

        if (empty($name)) {
            jsonResponse(["success" => false, "message" => "Category name is required"], 400);
        }

        if (empty($slug)) {
            $slug = createSlug($name);
        } else {
            $slug = createSlug($slug);
        }

        // Check unique slug
        $chk = $pdo->prepare("SELECT id FROM categories WHERE slug = ?");
        $chk->execute([$slug]);
        if ($chk->fetch()) {
            $slug .= '-' . time();
        }

        $stmt = $pdo->prepare("INSERT INTO categories (name, name_ta, slug, status, display_order) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $nameTa, $slug, $status, $displayOrder]);
        $newId = $pdo->lastInsertId();

        jsonResponse([
            "success" => true,
            "message" => "Category created successfully",
            "category_id" => $newId
        ], 201);
        break;

    case 'PUT':
        $admin = authenticateAdmin($pdo);
        $id = intval($data['id'] ?? $_GET['id'] ?? 0);
        $name = trim($data['name'] ?? '');
        $nameTa = isset($data['name_ta']) ? trim($data['name_ta']) : null;
        $slug = trim($data['slug'] ?? '');
        $status = in_array($data['status'] ?? '', ['active', 'inactive']) ? $data['status'] : 'active';
        $displayOrder = intval($data['display_order'] ?? 0);

        if ($id <= 0) {
            jsonResponse(["success" => false, "message" => "Invalid category ID"], 400);
        }

        if (empty($name)) {
            jsonResponse(["success" => false, "message" => "Category name is required"], 400);
        }

        if (empty($slug)) {
            $slug = createSlug($name);
        } else {
            $slug = createSlug($slug);
        }

        // Check slug uniqueness excluding self
        $chk = $pdo->prepare("SELECT id FROM categories WHERE slug = ? AND id != ?");
        $chk->execute([$slug, $id]);
        if ($chk->fetch()) {
            $slug .= '-' . time();
        }

        $stmtCurrent = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmtCurrent->execute([$id]);
        $curr = $stmtCurrent->fetch();
        if ($nameTa === null && $curr) {
            $nameTa = $curr['name_ta'];
        }

        $stmt = $pdo->prepare("UPDATE categories SET name = ?, name_ta = ?, slug = ?, status = ?, display_order = ? WHERE id = ?");
        $stmt->execute([$name, $nameTa, $slug, $status, $displayOrder, $id]);

        jsonResponse([
            "success" => true,
            "message" => "Category updated successfully"
        ]);
        break;

    case 'DELETE':
        $admin = authenticateAdmin($pdo);
        $id = intval($data['id'] ?? $_GET['id'] ?? 0);

        if ($id <= 0) {
            jsonResponse(["success" => false, "message" => "Invalid category ID"], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse([
            "success" => true,
            "message" => "Category deleted successfully"
        ]);
        break;

    default:
        jsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}
