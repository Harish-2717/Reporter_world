<?php
// api/news/index.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

list($method, $data) = getRequestData();

switch ($method) {
    case 'GET':
        $newsId = $_GET['id'] ?? null;
        $slug = $_GET['slug'] ?? null;
        $categorySlug = $_GET['category'] ?? null;
        $categoryId = $_GET['category_id'] ?? null;
        $isFeatured = isset($_GET['featured']) ? intval($_GET['featured']) : null;
        $isAdmin = isset($_GET['admin']) && $_GET['admin'] == '1';
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = max(1, min(100, intval($_GET['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;
        $search = trim($_GET['search'] ?? '');

        // 1. Single news detail
        if ($newsId || $slug) {
            $sql = "SELECT n.*, c.name as category_name, c.slug as category_slug, c.name_ta as category_name_ta 
                    FROM news n 
                    JOIN categories c ON n.category_id = c.id 
                    WHERE " . ($newsId ? "n.id = ?" : "n.slug = ?");
            
            if (!$isAdmin) {
                $sql .= " AND n.status = 'published'";
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$newsId ?: $slug]);
            $item = $stmt->fetch();

            if (!$item) {
                jsonResponse(["success" => false, "message" => "News article not found"], 404);
            }

            // Increment views if public view
            if (!$isAdmin) {
                $upd = $pdo->prepare("UPDATE news SET views = views + 1 WHERE id = ?");
                $upd->execute([$item['id']]);
                $item['views']++;
            }

            // Fetch related news in same category
            $relStmt = $pdo->prepare("SELECT n.id, n.title, n.title_ta, n.slug, n.short_description, n.short_description_ta, n.image, n.published_at, c.name as category_name, c.slug as category_slug, c.name_ta as category_name_ta 
                                      FROM news n 
                                      JOIN categories c ON n.category_id = c.id 
                                      WHERE n.category_id = ? AND n.id != ? AND n.status = 'published' 
                                      ORDER BY n.published_at DESC LIMIT 4");
            $relStmt->execute([$item['category_id'], $item['id']]);
            $related = $relStmt->fetchAll();

            jsonResponse([
                "success" => true,
                "news" => $item,
                "related_news" => $related
            ]);
        }

        // 2. List news with filters & pagination
        $where = [];
        $params = [];

        if (!$isAdmin) {
            $where[] = "n.status = 'published'";
        }

        if ($categorySlug) {
            $where[] = "c.slug = ?";
            $params[] = $categorySlug;
        }

        if ($categoryId) {
            $where[] = "n.category_id = ?";
            $params[] = $categoryId;
        }

        if ($isFeatured !== null) {
            $where[] = "n.is_featured = ?";
            $params[] = $isFeatured;
        }

        if (!empty($search)) {
            $where[] = "(n.title LIKE ? OR n.title_ta LIKE ? OR n.short_description LIKE ? OR n.short_description_ta LIKE ? OR n.content LIKE ? OR n.content_ta LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $whereClause = !empty($where) ? " WHERE " . implode(" AND ", $where) : "";

        // Count total
        $countSql = "SELECT COUNT(n.id) as total 
                     FROM news n 
                     JOIN categories c ON n.category_id = c.id" . $whereClause;
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = intval($countStmt->fetch()['total'] ?? 0);

        // Fetch records
        $sql = "SELECT n.*, c.name as category_name, c.slug as category_slug, c.name_ta as category_name_ta 
                FROM news n 
                JOIN categories c ON n.category_id = c.id 
                $whereClause 
                ORDER BY n.published_at DESC 
                LIMIT $limit OFFSET $offset";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $newsList = $stmt->fetchAll();

        jsonResponse([
            "success" => true,
            "total" => $total,
            "page" => $page,
            "limit" => $limit,
            "total_pages" => ceil($total / $limit),
            "news" => $newsList
        ]);
        break;

    case 'POST':
        $admin = authenticateAdmin($pdo);

        $categoryId = intval($data['category_id'] ?? 0);
        $title = trim($data['title'] ?? '');
        $titleTa = trim($data['title_ta'] ?? '');
        $slug = trim($data['slug'] ?? '');
        $shortDesc = trim($data['short_description'] ?? '');
        $shortDescTa = trim($data['short_description_ta'] ?? '');
        $content = trim($data['content'] ?? '');
        $contentTa = trim($data['content_ta'] ?? '');
        $author = trim($data['author'] ?? 'Reporter');
        $publishedAt = !empty($data['published_at']) ? $data['published_at'] : date('Y-m-d H:i:s');
        $status = in_array($data['status'] ?? '', ['published', 'draft']) ? $data['status'] : 'published';
        $isFeatured = !empty($data['is_featured']) && $data['is_featured'] != '0' ? 1 : 0;

        if (empty($title) || empty($shortDesc) || empty($content) || $categoryId <= 0) {
            jsonResponse([
                "success" => false,
                "message" => "Title, short description, content, and category are required."
            ], 400);
        }

        // Handle Image Upload
        $imageName = handleUploadedImage('image');
        if (!$imageName && !empty($data['image_url'])) {
            $imageName = $data['image_url'];
        }

        if (empty($slug)) {
            $slug = createSlug($title);
        } else {
            $slug = createSlug($slug);
        }

        // Ensure unique slug
        $chk = $pdo->prepare("SELECT id FROM news WHERE slug = ?");
        $chk->execute([$slug]);
        if ($chk->fetch()) {
            $slug .= '-' . time();
        }

        $stmt = $pdo->prepare("INSERT INTO news (category_id, title, title_ta, slug, short_description, short_description_ta, content, content_ta, image, author, published_at, status, is_featured) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $categoryId, $title, $titleTa, $slug, $shortDesc, $shortDescTa, $content, $contentTa, $imageName, $author, $publishedAt, $status, $isFeatured
        ]);
        $newId = $pdo->lastInsertId();

        jsonResponse([
            "success" => true,
            "message" => "News article published successfully.",
            "news_id" => $newId
        ], 201);
        break;

    case 'PUT':
        $admin = authenticateAdmin($pdo);

        $id = intval($data['id'] ?? $_GET['id'] ?? 0);
        if ($id <= 0) {
            jsonResponse(["success" => false, "message" => "Invalid news ID"], 400);
        }

        $stmtCurrent = $pdo->prepare("SELECT * FROM news WHERE id = ?");
        $stmtCurrent->execute([$id]);
        $currentNews = $stmtCurrent->fetch();
        if (!$currentNews) {
            jsonResponse(["success" => false, "message" => "News article not found"], 404);
        }

        $categoryId = isset($data['category_id']) ? intval($data['category_id']) : $currentNews['category_id'];
        $title = isset($data['title']) ? trim($data['title']) : $currentNews['title'];
        $titleTa = isset($data['title_ta']) ? trim($data['title_ta']) : ($currentNews['title_ta'] ?? null);
        $slug = isset($data['slug']) ? trim($data['slug']) : $currentNews['slug'];
        $shortDesc = isset($data['short_description']) ? trim($data['short_description']) : $currentNews['short_description'];
        $shortDescTa = isset($data['short_description_ta']) ? trim($data['short_description_ta']) : ($currentNews['short_description_ta'] ?? null);
        $content = isset($data['content']) ? trim($data['content']) : $currentNews['content'];
        $contentTa = isset($data['content_ta']) ? trim($data['content_ta']) : ($currentNews['content_ta'] ?? null);
        $author = isset($data['author']) ? trim($data['author']) : $currentNews['author'];
        $publishedAt = isset($data['published_at']) ? $data['published_at'] : $currentNews['published_at'];
        $status = isset($data['status']) && in_array($data['status'], ['published', 'draft']) ? $data['status'] : $currentNews['status'];
        $isFeatured = isset($data['is_featured']) ? (!empty($data['is_featured']) && $data['is_featured'] != '0' ? 1 : 0) : $currentNews['is_featured'];

        // Image handling
        $imageName = handleUploadedImage('image');
        if (!$imageName) {
            $imageName = $data['image_url'] ?? $currentNews['image'];
        }

        if (empty($slug)) {
            $slug = createSlug($title);
        } else {
            $slug = createSlug($slug);
        }

        $chk = $pdo->prepare("SELECT id FROM news WHERE slug = ? AND id != ?");
        $chk->execute([$slug, $id]);
        if ($chk->fetch()) {
            $slug .= '-' . time();
        }

        $updateSql = "UPDATE news SET 
                      category_id = ?, title = ?, title_ta = ?, slug = ?, short_description = ?, short_description_ta = ?, content = ?, content_ta = ?, 
                      image = ?, author = ?, published_at = ?, status = ?, is_featured = ? 
                      WHERE id = ?";
        $stmt = $pdo->prepare($updateSql);
        $stmt->execute([
            $categoryId, $title, $titleTa, $slug, $shortDesc, $shortDescTa, $content, $contentTa,
            $imageName, $author, $publishedAt, $status, $isFeatured, $id
        ]);

        jsonResponse([
            "success" => true,
            "message" => "News article updated successfully."
        ]);
        break;

    case 'DELETE':
        $admin = authenticateAdmin($pdo);

        $id = intval($data['id'] ?? $_GET['id'] ?? 0);
        if ($id <= 0) {
            jsonResponse(["success" => false, "message" => "Invalid news ID"], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$id]);

        jsonResponse([
            "success" => true,
            "message" => "News article deleted successfully."
        ]);
        break;

    default:
        jsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}
