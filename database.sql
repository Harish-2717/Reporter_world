-- Database Schema for Reporter World – Voice of the World
CREATE DATABASE IF NOT EXISTS reporter_world_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reporter_world_db;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255) NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ta VARCHAR(100) NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. News Table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_ta VARCHAR(255) NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    short_description_ta TEXT NULL,
    content LONGTEXT NOT NULL,
    content_ta LONGTEXT NULL,
    image VARCHAR(255) NULL,
    author VARCHAR(100) DEFAULT 'Staff Reporter',
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('published', 'draft') DEFAULT 'published',
    is_featured TINYINT(1) DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Sliders Table
CREATE TABLE IF NOT EXISTS sliders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_ta VARCHAR(255) NULL,
    description TEXT NULL,
    description_ta TEXT NULL,
    image VARCHAR(255) NOT NULL,
    button_text VARCHAR(100) DEFAULT 'Read Full Story',
    button_text_ta VARCHAR(100) NULL,
    link VARCHAR(255) NULL,
    display_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Company Settings Table
CREATE TABLE IF NOT EXISTS company_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    tagline_ta VARCHAR(255) NULL,
    logo VARCHAR(255) NULL,
    is_logo_active TINYINT(1) DEFAULT 1,
    phone VARCHAR(50) NULL,
    email VARCHAR(100) NULL,
    address TEXT NULL,
    address_ta TEXT NULL,
    facebook VARCHAR(255) NULL,
    instagram VARCHAR(255) NULL,
    youtube VARCHAR(255) NULL,
    twitter VARCHAR(255) NULL,
    footer_text TEXT NULL,
    footer_text_ta TEXT NULL,
    copyright_text VARCHAR(255) NULL,
    copyright_text_ta VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data

-- Initial Admin (admin@reporterworld.com / admin123)
INSERT INTO admins (name, email, password, status)
VALUES ('Administrator', 'admin@reporterworld.com', '$2y$10$4A.QagMWHib0mrWpH5hKg.QqepVgypQagrfHBcQN8kBN/KXwZskaG', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Initial Categories
INSERT INTO categories (id, name, slug, status, display_order) VALUES
(1, 'Politics', 'politics', 'active', 1),
(2, 'Cinema', 'cinema', 'active', 2),
(3, 'Sports', 'sports', 'active', 3),
(4, 'World', 'world', 'active', 4)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Initial Company Settings
INSERT INTO company_settings (id, company_name, tagline, logo, is_logo_active, phone, email, address, facebook, instagram, youtube, twitter, footer_text, copyright_text)
VALUES (
    1,
    'Reporter World',
    'Voice of the World | Global News & Independent Journalism',
    'logo.png',
    1,
    '+91 98765 43210',
    'contact@reporterworld.com',
    'Headquarters, Anna Salai, Chennai - 600002, Tamil Nadu, India.',
    'https://facebook.com/reporterworld',
    'https://instagram.com/reporterworld',
    'https://youtube.com/@reporterworld',
    'https://twitter.com/reporterworld',
    'Reporter World brings you authentic breaking news, insightful political coverage, entertainment highlights, and real-time investigative journalism worldwide.',
    '© 2026 Reporter World. All rights reserved.'
)
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), tagline=VALUES(tagline);

-- Initial Sliders
INSERT INTO sliders (title, description, image, button_text, link, display_order, status) VALUES
(
    'Global Economic Summit Unveils New Multilateral Trade Accords',
    'World leaders and international financial experts announce milestone sustainable infrastructure and economic growth pacts.',
    'slider1.jpg',
    'Read Full Story',
    '/news/state-budget-session-key-allocations',
    1,
    'active'
),
(
    'International Cinema Awards Celebrate Groundbreaking Masterpieces',
    'A star-studded weekend honoring visionary directors, pioneering screenplays, and outstanding global film achievements.',
    'slider2.jpg',
    'Explore Cinema',
    '/news/grand-cinematic-gala-musical-extravaganza',
    2,
    'active'
),
(
    'Crucial National Debates Heat Up Ahead of Legislative Elections',
    'Major political alliances unveil strategic manifestos and policy commitments as campaign momentum intensifies nationwide.',
    'slider3.jpg',
    'Election Watch',
    '/news/interstate-council-convenes-trade-tax-relief',
    3,
    'active'
);

-- Initial News Articles
INSERT INTO news (id, category_id, title, slug, short_description, content, image, author, published_at, status, is_featured) VALUES
(
    1,
    1,
    'State Budget Session: Key Allocations for Infrastructure and Sustainable Growth',
    'state-budget-session-key-allocations',
    'Major financial commitments announced for clean water, modern transport grids, and educational excellence.',
    '<p>The Legislative Assembly commenced its budget session with comprehensive discussions on statewide civic infrastructure, youth employment, and educational modernisation.</p><p>Addressing the assembly, the leadership emphasized balanced economic growth across all regions with substantial funding earmarked for public health and skill development initiatives.</p><p>Key ministry heads provided detailed briefings on sustainable rural initiatives, with debate scheduled to continue throughout the legislative week.</p>',
    'news_politics_1.jpg',
    'Political Bureau',
    '2026-09-24 10:30:00',
    'published',
    1
),
(
    2,
    1,
    'Interstate Council Convenes to Streamline Trade Regulations and Tax Relief',
    'interstate-council-convenes-trade-tax-relief',
    'Delegates advocate rationalized compliance measures to stimulate manufacturing and MSME export growth.',
    '<p>Finance ministers and industry delegates gathered for high-level consultations to address supply chain optimization and simplify bureaucratic filings for small enterprises.</p><p>State delegations presented targeted proposals advocating exemptions on essential farming implements and sustainable textile manufacturing units.</p><p>The council unanimously ratified several forward-looking procedural reforms aimed at fostering cross-border commerce.</p>',
    'news_politics_2.jpg',
    'Chief Economics Correspondent',
    '2026-09-24 09:15:00',
    'published',
    1
),
(
    3,
    1,
    'Civic Governance Modernization: Digital Portals Launched for Urban and Rural Hubs',
    'civic-governance-modernization-digital-portals',
    'New civic tech framework introduces real-time public service tracking and enhanced administrative transparency.',
    '<p>A cutting-edge digital governance ecosystem has been officially rolled out to streamline municipal approvals, utility monitoring, and public grievance resolution.</p><p>Citizens can now track local development expenditures and council resolutions directly from their smartphones, improving civic engagement.</p>',
    'news_politics_3.jpg',
    'Public Affairs Desk',
    '2026-09-23 16:45:00',
    'published',
    0
),
(
    4,
    1,
    'Major Industrial Park Expansions Announced: Thousands of High-Tech Jobs on Horizon',
    'major-industrial-park-expansions-high-tech-jobs',
    'Government approves multi-million dollar tech corridor development to attract global electronics and green mobility manufacturers.',
    '<p>The state cabinet has granted formal approval for five specialized industrial development corridors equipped with high-speed logistics and renewable power grids.</p><p>Leading international tech firms have expressed commitment to establish manufacturing centers, promising over 150,000 employment opportunities over the next three years.</p>',
    'news_politics_4.jpg',
    'Industrial Correspondent',
    '2026-09-23 14:00:00',
    'published',
    0
),
(
    5,
    2,
    'Grand Cinematic Gala and Musical Extravaganza Draws Thousands of Film Enthusiasts',
    'grand-cinematic-gala-musical-extravaganza',
    'Enthusiastic audiences gather in Chennai as leading stars and international composers unveil the season’s most anticipated soundtrack.',
    '<p>A dazzling music premiere drew prominent filmmakers, legendary composers, and passionate film lovers for an unforgettable evening celebrating cinematic artistry.</p><p>The director remarked that the production represents over two years of intensive craftsmanship, pushing technical boundaries in sound design and visual storytelling.</p>',
    'news_cinema_1.jpg',
    'Entertainment Desk',
    '2026-09-24 11:00:00',
    'published',
    1
),
(
    6,
    2,
    'Independent Film Wins International Gold: Worldwide Acclaim for Authentic Storytelling',
    'independent-film-wins-international-gold',
    'Compelling narrative chronicling real-world journeys earns top directing honors at renowned European Film Festival.',
    '<p>Competing against 150 global productions, this poignant independent drama captured the prestigious Golden Trophy for Best Director at the international film forum.</p><p>Critics praised the movie’s nuanced character studies and visual poetry, heralding a new era for regional filmmaking on the world stage.</p>',
    'news_cinema_2.jpg',
    'Cinema Critic',
    '2026-09-24 08:30:00',
    'published',
    1
),
(
    7,
    2,
    'Epic Historical Drama Teaser Shatters Digital Records Across Platforms',
    'epic-historical-drama-teaser-shatters-records',
    'Spectacular visual effects, grandiose battle choreography, and rousing score capture over 30 million views within 24 hours.',
    '<p>The first official teaser for the upcoming period blockbuster has captured the imagination of cinema fans worldwide, trending #1 across global media channels.</p><p>Featuring groundbreaking CGI, bespoke historical costuming, and sweeping cinematography, the film is scheduled for a worldwide release across five languages.</p>',
    'news_cinema_3.jpg',
    'Film Trends Desk',
    '2026-09-23 18:20:00',
    'published',
    0
),
(
    8,
    2,
    'The New Wave of Visionary Screenwriters: Redefining Modern Cinema Narratives',
    'new-wave-visionary-screenwriters-modern-cinema',
    'Contemporary filmmakers embrace character-driven depth and original screenplays over traditional formulas.',
    '<p>A review of recent box-office sensations reveals that compelling storytelling, grounded emotional realism, and fresh perspectives are winning over audiences worldwide.</p><p>Both theatrical distributors and streaming platforms report surging demand for inventive narratives that champion fresh artistic voices.</p>',
    'news_cinema_4.jpg',
    'Film Studies Bureau',
    '2026-09-23 12:10:00',
    'published',
    0
)
ON DUPLICATE KEY UPDATE title=VALUES(title);
