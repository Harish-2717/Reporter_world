<?php
// c:\xampp\htdocs\Reporter World\scratch\migrate_to_english.php
require_once __DIR__ . '/../api/config/database.php';

$db = new Database();
$pdo = $db->getConnection();

echo "Starting English migration...\n";

// 1. Update Admin
$pdo->exec("UPDATE admins SET name = 'Administrator' WHERE id = 1");
echo "Updated Admin\n";

// 2. Update Categories
$categories = [
    ['id' => 1, 'name' => 'Politics', 'slug' => 'politics'],
    ['id' => 2, 'name' => 'Cinema', 'slug' => 'cinema'],
    ['id' => 3, 'name' => 'Sports', 'slug' => 'sports'],
    ['id' => 4, 'name' => 'World', 'slug' => 'world'],
];
$catStmt = $pdo->prepare("UPDATE categories SET name = ? WHERE id = ?");
foreach ($categories as $cat) {
    $catStmt->execute([$cat['name'], $cat['id']]);
}
echo "Updated Categories\n";

// 3. Update Company Settings
$pdo->exec("UPDATE company_settings SET 
    company_name = 'Reporter World',
    tagline = 'Voice of the World | Global News & Independent Journalism',
    address = 'Headquarters, Anna Salai, Chennai - 600002, Tamil Nadu, India.',
    footer_text = 'Reporter World brings you authentic breaking news, insightful political coverage, entertainment highlights, and real-time investigative journalism worldwide.',
    copyright_text = '© 2026 Reporter World. All rights reserved.'
    WHERE id = 1");
echo "Updated Company Settings\n";

// 4. Update Sliders
$sliders = [
    [
        'id' => 1,
        'title' => 'Global Economic Summit Unveils New Multilateral Trade Accords',
        'description' => 'World leaders and international financial experts announce milestone sustainable infrastructure and economic growth pacts.',
        'button_text' => 'Read Full Story'
    ],
    [
        'id' => 2,
        'title' => 'International Cinema Awards Celebrate Groundbreaking Masterpieces',
        'description' => 'A star-studded weekend honoring visionary directors, pioneering screenplays, and outstanding global film achievements.',
        'button_text' => 'Explore Cinema'
    ],
    [
        'id' => 3,
        'title' => 'Crucial National Debates Heat Up Ahead of Legislative Elections',
        'description' => 'Major political alliances unveil strategic manifestos and policy commitments as campaign momentum intensifies nationwide.',
        'button_text' => 'Election Watch'
    ]
];
$sliderStmt = $pdo->prepare("UPDATE sliders SET title = ?, description = ?, button_text = ? WHERE id = ?");
foreach ($sliders as $s) {
    $sliderStmt->execute([$s['title'], $s['description'], $s['button_text'], $s['id']]);
}
echo "Updated Sliders\n";

// 5. Update News Articles
$newsItems = [
    [
        'id' => 1,
        'title' => 'State Budget Session: Key Allocations for Infrastructure and Sustainable Growth',
        'slug' => 'state-budget-session-key-allocations',
        'short_description' => 'Major financial commitments announced for clean water, modern transport grids, and educational excellence.',
        'content' => '<p>The Legislative Assembly commenced its budget session with comprehensive discussions on statewide civic infrastructure, youth employment, and educational modernisation.</p><p>Addressing the assembly, the leadership emphasized balanced economic growth across all regions with substantial funding earmarked for public health and skill development initiatives.</p><p>Key ministry heads provided detailed briefings on sustainable rural initiatives, with debate scheduled to continue throughout the legislative week.</p>',
        'author' => 'Political Bureau'
    ],
    [
        'id' => 2,
        'title' => 'Interstate Council Convenes to Streamline Trade Regulations and Tax Relief',
        'slug' => 'interstate-council-convenes-trade-tax-relief',
        'short_description' => 'Delegates advocate rationalized compliance measures to stimulate manufacturing and MSME export growth.',
        'content' => '<p>Finance ministers and industry delegates gathered for high-level consultations to address supply chain optimization and simplify bureaucratic filings for small enterprises.</p><p>State delegations presented targeted proposals advocating exemptions on essential farming implements and sustainable textile manufacturing units.</p><p>The council unanimously ratified several forward-looking procedural reforms aimed at fostering cross-border commerce.</p>',
        'author' => 'Chief Economics Correspondent'
    ],
    [
        'id' => 3,
        'title' => 'Civic Governance Modernization: Digital Portals Launched for Urban and Rural Hubs',
        'slug' => 'civic-governance-modernization-digital-portals',
        'short_description' => 'New civic tech framework introduces real-time public service tracking and enhanced administrative transparency.',
        'content' => '<p>A cutting-edge digital governance ecosystem has been officially rolled out to streamline municipal approvals, utility monitoring, and public grievance resolution.</p><p>Citizens can now track local development expenditures and council resolutions directly from their smartphones, improving civic engagement.</p>',
        'author' => 'Public Affairs Desk'
    ],
    [
        'id' => 4,
        'title' => 'Major Industrial Park Expansions Announced: Thousands of High-Tech Jobs on Horizon',
        'slug' => 'major-industrial-park-expansions-high-tech-jobs',
        'short_description' => 'Government approves multi-million dollar tech corridor development to attract global electronics and green mobility manufacturers.',
        'content' => '<p>The state cabinet has granted formal approval for five specialized industrial development corridors equipped with high-speed logistics and renewable power grids.</p><p>Leading international tech firms have expressed commitment to establish manufacturing centers, promising over 150,000 employment opportunities over the next three years.</p>',
        'author' => 'Industrial Correspondent'
    ],
    [
        'id' => 5,
        'title' => 'Grand Cinematic Gala and Musical Extravaganza Draws Thousands of Film Enthusiasts',
        'slug' => 'grand-cinematic-gala-musical-extravaganza',
        'short_description' => 'Enthusiastic audiences gather in Chennai as leading stars and international composers unveil the season’s most anticipated soundtrack.',
        'content' => '<p>A dazzling music premiere drew prominent filmmakers, legendary composers, and passionate film lovers for an unforgettable evening celebrating cinematic artistry.</p><p>The director remarked that the production represents over two years of intensive craftsmanship, pushing technical boundaries in sound design and visual storytelling.</p>',
        'author' => 'Entertainment Desk'
    ],
    [
        'id' => 6,
        'title' => 'Independent Film Wins International Gold: Worldwide Acclaim for Authentic Storytelling',
        'slug' => 'independent-film-wins-international-gold',
        'short_description' => 'Compelling narrative chronicling real-world journeys earns top directing honors at renowned European Film Festival.',
        'content' => '<p>Competing against 150 global productions, this poignant independent drama captured the prestigious Golden Trophy for Best Director at the international film forum.</p><p>Critics praised the movie’s nuanced character studies and visual poetry, heralding a new era for regional filmmaking on the world stage.</p>',
        'author' => 'Cinema Critic'
    ],
    [
        'id' => 7,
        'title' => 'Epic Historical Drama Teaser Shatters Digital Records Across Platforms',
        'slug' => 'epic-historical-drama-teaser-shatters-records',
        'short_description' => 'Spectacular visual effects, grandiose battle choreography, and rousing score capture over 30 million views within 24 hours.',
        'content' => '<p>The first official teaser for the upcoming period blockbuster has captured the imagination of cinema fans worldwide, trending #1 across global media channels.</p><p>Featuring groundbreaking CGI, bespoke historical costuming, and sweeping cinematography, the film is scheduled for a worldwide release across five languages.</p>',
        'author' => 'Film Trends Desk'
    ],
    [
        'id' => 8,
        'title' => 'The New Wave of Visionary Screenwriters: Redefining Modern Cinema Narratives',
        'slug' => 'new-wave-visionary-screenwriters-modern-cinema',
        'short_description' => 'Contemporary filmmakers embrace character-driven depth and original screenplays over traditional formulas.',
        'content' => '<p>A review of recent box-office sensations reveals that compelling storytelling, grounded emotional realism, and fresh perspectives are winning over audiences worldwide.</p><p>Both theatrical distributors and streaming platforms report surging demand for inventive narratives that champion fresh artistic voices.</p>',
        'author' => 'Film Studies Bureau'
    ]
];

$newsStmt = $pdo->prepare("UPDATE news SET title = ?, slug = ?, short_description = ?, content = ?, author = ? WHERE id = ?");
foreach ($newsItems as $n) {
    $newsStmt->execute([$n['title'], $n['slug'], $n['short_description'], $n['content'], $n['author'], $n['id']]);
}
echo "Updated News Items\n";

echo "Migration to English completed successfully!\n";
