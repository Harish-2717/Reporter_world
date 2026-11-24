<?php
// api/dashboard/index.php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = new Database();
$pdo = $db->getConnection();

$admin = authenticateAdmin($pdo);

// 1. Total News
$totalNews = $pdo->query("SELECT COUNT(*) FROM news")->fetchColumn();

// 2. Politics News (by slug 'politics')
$stmtPol = $pdo->prepare("SELECT COUNT(n.id) FROM news n JOIN categories c ON n.category_id = c.id WHERE c.slug = 'politics'");
$stmtPol->execute();
$politicsNews = $stmtPol->fetchColumn();

// 3. Cinema News (by slug 'cinema')
$stmtCin = $pdo->prepare("SELECT COUNT(n.id) FROM news n JOIN categories c ON n.category_id = c.id WHERE c.slug = 'cinema'");
$stmtCin->execute();
$cinemaNews = $stmtCin->fetchColumn();

// 4. Total Categories
$totalCategories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();

// 5. Active Sliders
$activeSliders = $pdo->query("SELECT COUNT(*) FROM sliders WHERE status = 'active'")->fetchColumn();

// 6. Total Views
$totalViews = $pdo->query("SELECT COALESCE(SUM(views), 0) FROM news")->fetchColumn();

// 7. Recent News Articles (top 6)
$recentStmt = $pdo->query("SELECT n.id, n.title, n.slug, n.status, n.is_featured, n.views, n.published_at, n.image, c.name as category_name, c.slug as category_slug 
                           FROM news n 
                           JOIN categories c ON n.category_id = c.id 
                           ORDER BY n.created_at DESC LIMIT 6");
$recentNews = $recentStmt->fetchAll();

// 8. Recent Sliders / Banners (top 5)
$sliderStmt = $pdo->query("SELECT id, title, image, display_order, status, created_at, link 
                           FROM sliders 
                           ORDER BY display_order ASC, created_at DESC LIMIT 5");
$recentSliders = $sliderStmt->fetchAll();

// 9. Categories Overview with news counts
$catStmt = $pdo->query("SELECT c.id, c.name, c.slug, c.status, COUNT(n.id) as news_count 
                        FROM categories c 
                        LEFT JOIN news n ON c.id = n.category_id 
                        GROUP BY c.id 
                        ORDER BY c.display_order ASC");
$categoriesOverview = $catStmt->fetchAll();

jsonResponse([
    "success" => true,
    "admin" => $admin,
    "stats" => [
        "total_news" => intval($totalNews),
        "politics_news" => intval($politicsNews),
        "cinema_news" => intval($cinemaNews),
        "total_categories" => intval($totalCategories),
        "active_sliders" => intval($activeSliders),
        "total_views" => intval($totalViews)
    ],
    "recent_news" => $recentNews,
    "recent_sliders" => $recentSliders,
    "categories_overview" => $categoriesOverview
]);
