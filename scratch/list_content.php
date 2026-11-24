<?php
require_once __DIR__ . '/../api/config/database.php';
$db = new Database();
$pdo = $db->getConnection();
$news = $pdo->query("SELECT id, category_id, title, slug, short_description FROM news")->fetchAll();
echo "NEWS COUNT: " . count($news) . "\n";
foreach ($news as $n) {
    echo "#" . $n['id'] . " [" . $n['slug'] . "] " . $n['title'] . "\n";
}
echo "\nSLIDERS:\n";
$sliders = $pdo->query("SELECT id, title, description, button_text FROM sliders")->fetchAll();
foreach ($sliders as $s) {
    echo "#" . $s['id'] . " " . $s['title'] . "\n";
}
