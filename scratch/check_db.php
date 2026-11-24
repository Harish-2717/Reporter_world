<?php
require_once __DIR__ . '/../api/config/database.php';
$db = new Database();
$pdo = $db->getConnection();
echo "TABLES:\n";
foreach ($pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN) as $tbl) {
    echo "  - $tbl\n";
}
echo "\nNEWS COLUMNS:\n";
foreach ($pdo->query("DESCRIBE news")->fetchAll() as $col) {
    echo "  " . $col['Field'] . " (" . $col['Type'] . ")\n";
}
echo "\nSLIDERS COLUMNS:\n";
foreach ($pdo->query("DESCRIBE sliders")->fetchAll() as $col) {
    echo "  " . $col['Field'] . " (" . $col['Type'] . ")\n";
}
echo "\nCATEGORIES COLUMNS:\n";
foreach ($pdo->query("DESCRIBE categories")->fetchAll() as $col) {
    echo "  " . $col['Field'] . " (" . $col['Type'] . ")\n";
}
echo "\nCOMPANY SETTINGS COLUMNS:\n";
foreach ($pdo->query("DESCRIBE company_settings")->fetchAll() as $col) {
    echo "  " . $col['Field'] . " (" . $col['Type'] . ")\n";
}
echo "\nNEWS SAMPLE (first 2):\n";
foreach ($pdo->query("SELECT * FROM news LIMIT 2")->fetchAll() as $row) {
    echo "  ID: " . $row['id'] . " | Title: " . $row['title'] . "\n";
}
