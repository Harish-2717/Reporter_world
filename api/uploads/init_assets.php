<?php
// api/uploads/init_assets.php
$dir = __DIR__;

function createSvgBanner($filename, $title, $tag, $gradientStart, $gradientEnd, $accentColor) {
    $titleSafe = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $tagSafe = htmlspecialchars($tag, ENT_QUOTES, 'UTF-8');
    
    $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{$gradientStart}" />
      <stop offset="100%" stop-color="{$gradientEnd}" />
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#050505" stop-opacity="0.92" />
      <stop offset="60%" stop-color="#0f0f0f" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>

  <!-- Geometric Abstract Shapes -->
  <circle cx="1050" cy="150" r="260" fill="{$accentColor}" opacity="0.15" />
  <circle cx="150" cy="500" r="200" fill="{$gradientStart}" opacity="0.2" />
  <polygon points="1200,0 850,0 1200,450" fill="rgba(255,255,255,0.03)" />
  <polygon points="0,350 400,675 0,675" fill="rgba(0,0,0,0.25)" />

  <!-- Shadow Overlay -->
  <rect width="100%" height="100%" fill="url(#overlay)"/>

  <!-- Top Badge -->
  <rect x="70" y="60" width="220" height="44" rx="22" fill="{$accentColor}"/>
  <text x="180" y="88" fill="#ffffff" font-family="'Inter', 'Montserrat', sans-serif" font-size="16" font-weight="700" letter-spacing="1.5" text-anchor="middle">{$tagSafe}</text>

  <!-- News Channel Brand Watermark -->
  <text x="1130" y="90" fill="rgba(255,255,255,0.7)" font-family="'Montserrat', sans-serif" font-size="18" font-weight="900" letter-spacing="2" text-anchor="end">REPORTER WORLD</text>
  <circle cx="1150" cy="82" r="6" fill="#e50914" />

  <!-- Decorative Accent Bar -->
  <rect x="70" y="440" width="10" height="110" rx="5" fill="{$accentColor}"/>

  <!-- Main Headline Title -->
  <text x="100" y="490" fill="#ffffff" font-family="'Montserrat', 'Inter', sans-serif" font-size="38" font-weight="800" letter-spacing="-0.5">
    {$titleSafe}
  </text>
  <text x="100" y="540" fill="#cbd5e1" font-family="'Inter', sans-serif" font-size="22" font-weight="500">
    Accurate &amp; Unbiased Global Coverage | REPORTER WORLD LIVE
  </text>
</svg>
SVG;

    file_put_contents(__DIR__ . '/' . $filename, $svg);
}

// 1. Initial Logo
$logoSvg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 140" width="540" height="140">
  <defs>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef1616"/>
      <stop offset="100%" stop-color="#b80c0c"/>
    </linearGradient>
  </defs>
  
  <!-- Left Badge Globe / Mic Icon Box -->
  <rect x="10" y="15" width="110" height="110" rx="18" fill="url(#redGrad)"/>
  
  <!-- Globe / Broadcast Rings in Badge -->
  <circle cx="65" cy="70" r="34" fill="none" stroke="#ffffff" stroke-width="4.5"/>
  <ellipse cx="65" cy="70" rx="16" ry="34" fill="none" stroke="#ffffff" stroke-width="3"/>
  <line x1="31" y1="70" x2="99" y2="70" stroke="#ffffff" stroke-width="3"/>
  <circle cx="65" cy="70" r="7" fill="#ffffff"/>
  <!-- Broadcast waves -->
  <path d="M 85 45 A 28 28 0 0 1 85 95" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 95 35 A 42 42 0 0 1 95 105" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="3" stroke-linecap="round"/>

  <!-- English Title "REPORTER" -->
  <text x="140" y="65" fill="#111827" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="44" font-weight="900" letter-spacing="1.5">REPORTER</text>
  
  <!-- English Title "WORLD" in Red -->
  <text x="390" y="65" fill="#e50914" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="44" font-weight="900" letter-spacing="1.5">WORLD</text>

  <!-- Tagline Banner in English -->
  <rect x="140" y="80" width="375" height="34" rx="6" fill="#111827"/>
  <text x="327" y="103" fill="#ffffff" font-family="'Montserrat', 'Inter', sans-serif" font-size="16" font-weight="700" letter-spacing="2" text-anchor="middle">VOICE OF THE WORLD</text>
</svg>
SVG;
file_put_contents($dir . '/logo.svg', $logoSvg);
copy($dir . '/logo.svg', $dir . '/logo.png'); // Support both extensions

// 2. Sliders
createSvgBanner('slider1.svg', 'Global Economic Forum Unveils Major Growth Initiatives', 'WORLD NEWS', '#1e1b4b', '#0f172a', '#e50914');
createSvgBanner('slider2.svg', 'International Film Festival Celebrates Cinematic Masterpieces', 'ENTERTAINMENT', '#31102b', '#180715', '#ec4899');
createSvgBanner('slider3.svg', 'Crucial Electoral Milestones & Strategic Debates Heat Up', 'SPECIAL REPORT', '#1c1917', '#0c0a09', '#f97316');

copy($dir . '/slider1.svg', $dir . '/slider1.jpg');
copy($dir . '/slider2.svg', $dir . '/slider2.jpg');
copy($dir . '/slider3.svg', $dir . '/slider3.jpg');

// 3. News Politics
createSvgBanner('news_politics_1.svg', 'National Budget Overview: Key Financial Reforms Announced', 'POLITICS', '#1e293b', '#0f172a', '#dc2626');
createSvgBanner('news_politics_2.svg', 'International Trade Council Finalizes Bilateral Tariff Agreement', 'NATIONAL', '#1e1e24', '#111827', '#ea580c');
createSvgBanner('news_politics_3.svg', 'Urban Infrastructure Upgrades Get Green Light in Major Cities', 'DEVELOPMENT', '#132a13', '#061a06', '#16a34a');
createSvgBanner('news_politics_4.svg', 'Multi-Billion Clean Tech & Sustainable Energy Parks Launched', 'INDUSTRY', '#0f172a', '#1e293b', '#0284c7');

copy($dir . '/news_politics_1.svg', $dir . '/news_politics_1.jpg');
copy($dir . '/news_politics_2.svg', $dir . '/news_politics_2.jpg');
copy($dir . '/news_politics_3.svg', $dir . '/news_politics_3.jpg');
copy($dir . '/news_politics_4.svg', $dir . '/news_politics_4.jpg');

// 4. News Cinema
createSvgBanner('news_cinema_1.svg', 'Star-Studded Global Movie Premiere & Soundtrack Launch', 'CINEMA', '#4a044e', '#1e0120', '#f43f5e');
createSvgBanner('news_cinema_2.svg', 'Acclaimed Independent Film Wins Prestigious Gold Trophy', 'FILM FESTIVAL', '#3b0764', '#18022b', '#8b5cf6');
createSvgBanner('news_cinema_3.svg', 'Blockbuster Action Thriller Teaser Breaks Worldwide Records', 'TRENDING', '#450a0a', '#1a0505', '#ef4444');
createSvgBanner('news_cinema_4.svg', 'Visionary New Wave Directors Reshaping Contemporary Cinema', 'SPECIAL FEATURE', '#1f2937', '#111827', '#e11d48');

copy($dir . '/news_cinema_1.svg', $dir . '/news_cinema_1.jpg');
copy($dir . '/news_cinema_2.svg', $dir . '/news_cinema_2.jpg');
copy($dir . '/news_cinema_3.svg', $dir . '/news_cinema_3.jpg');
copy($dir . '/news_cinema_4.svg', $dir . '/news_cinema_4.jpg');

echo "Assets created successfully\n";
