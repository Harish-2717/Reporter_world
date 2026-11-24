<?php
// Serve the production SPA build
$distIndex = __DIR__ . '/dist/index.html';
$publicIndex = __DIR__ . '/public/index.html';
if (file_exists($distIndex)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($distIndex);
    exit;
} elseif (file_exists($publicIndex)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($publicIndex);
    exit;
} else {
    echo "<h1>Reporter World</h1><p>Please run <code>npm run build</code> inside the frontend directory.</p>";
}
