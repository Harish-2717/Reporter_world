<?php
// scratch/migrate_translations.php
require_once __DIR__ . '/../api/config/database.php';

$db = new Database();
$pdo = $db->getConnection();

echo "=== 1. CHECK & ADD TABLE COLUMNS ===\n";

function columnExists($pdo, $table, $column) {
    $stmt = $pdo->prepare("SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?");
    $stmt->execute([$table, $column]);
    return (bool) $stmt->fetch();
}

// 1. news table
if (!columnExists($pdo, 'news', 'title_ta')) {
    $pdo->exec("ALTER TABLE `news` ADD COLUMN `title_ta` VARCHAR(255) NULL AFTER `title`");
    echo "Added news.title_ta\n";
}
if (!columnExists($pdo, 'news', 'short_description_ta')) {
    $pdo->exec("ALTER TABLE `news` ADD COLUMN `short_description_ta` TEXT NULL AFTER `short_description`");
    echo "Added news.short_description_ta\n";
}
if (!columnExists($pdo, 'news', 'content_ta')) {
    $pdo->exec("ALTER TABLE `news` ADD COLUMN `content_ta` LONGTEXT NULL AFTER `content`");
    echo "Added news.content_ta\n";
}

// 2. sliders table
if (!columnExists($pdo, 'sliders', 'title_ta')) {
    $pdo->exec("ALTER TABLE `sliders` ADD COLUMN `title_ta` VARCHAR(255) NULL AFTER `title`");
    echo "Added sliders.title_ta\n";
}
if (!columnExists($pdo, 'sliders', 'description_ta')) {
    $pdo->exec("ALTER TABLE `sliders` ADD COLUMN `description_ta` TEXT NULL AFTER `description`");
    echo "Added sliders.description_ta\n";
}
if (!columnExists($pdo, 'sliders', 'button_text_ta')) {
    $pdo->exec("ALTER TABLE `sliders` ADD COLUMN `button_text_ta` VARCHAR(100) NULL AFTER `button_text`");
    echo "Added sliders.button_text_ta\n";
}

// 3. categories table
if (!columnExists($pdo, 'categories', 'name_ta')) {
    $pdo->exec("ALTER TABLE `categories` ADD COLUMN `name_ta` VARCHAR(100) NULL AFTER `name`");
    echo "Added categories.name_ta\n";
}

// 4. company_settings table
if (!columnExists($pdo, 'company_settings', 'tagline_ta')) {
    $pdo->exec("ALTER TABLE `company_settings` ADD COLUMN `tagline_ta` VARCHAR(255) NULL AFTER `tagline`");
    echo "Added company_settings.tagline_ta\n";
}
if (!columnExists($pdo, 'company_settings', 'address_ta')) {
    $pdo->exec("ALTER TABLE `company_settings` ADD COLUMN `address_ta` TEXT NULL AFTER `address`");
    echo "Added company_settings.address_ta\n";
}
if (!columnExists($pdo, 'company_settings', 'footer_text_ta')) {
    $pdo->exec("ALTER TABLE `company_settings` ADD COLUMN `footer_text_ta` TEXT NULL AFTER `footer_text`");
    echo "Added company_settings.footer_text_ta\n";
}
if (!columnExists($pdo, 'company_settings', 'copyright_text_ta')) {
    $pdo->exec("ALTER TABLE `company_settings` ADD COLUMN `copyright_text_ta` VARCHAR(255) NULL AFTER `copyright_text`");
    echo "Added company_settings.copyright_text_ta\n";
}

echo "\n=== 2. UPDATE CATEGORIES ===\n";
$catUpdates = [
    'politics' => 'அரசியல்',
    'cinema'   => 'சினிமா',
    'sports'   => 'விளையாட்டு',
    'world'    => 'உலகம்'
];
$catStmt = $pdo->prepare("UPDATE categories SET name_ta = ? WHERE slug = ?");
foreach ($catUpdates as $slug => $name_ta) {
    $catStmt->execute([$name_ta, $slug]);
    echo "Updated category $slug -> $name_ta\n";
}

echo "\n=== 3. UPDATE SLIDERS ===\n";
$sliderUpdates = [
    1 => [
        'title_ta' => 'உலகப் பொருளாதார உச்சி மாநாடு: புதிய பலதரப்பு வர்த்தக ஒப்பந்தங்கள் கையெழுத்து',
        'description_ta' => 'நீடித்த உள்கட்டமைப்பு மற்றும் உலக பொருளாதார வளர்ச்சிக்கான முக்கிய திட்டங்களை உலகத் தலைவர்கள் அறிவித்தனர்.',
        'button_text_ta' => 'முழு செய்தியையும் படிக்க'
    ],
    2 => [
        'title_ta' => 'சர்வதேச சினிமா விருதுகள் விழா: சிறந்த திரைப் படைப்புகளுக்கு உயரிய விருதுகள்',
        'description_ta' => 'முன்னணி இயக்குநர்கள், சிறந்த திரைக்கதைகள் மற்றும் உலகத் திரைப்பட சாதனைகளைக் கௌரவிக்கும் நட்சத்திர விழா.',
        'button_text_ta' => 'சினிமா செய்திகளை ஆராய்க'
    ],
    3 => [
        'title_ta' => 'தேர்தல் களம் சூடுபிடிப்பு: அரசியல் கூட்டணிகளின் தீவிர பிரச்சாரம் மற்றும் விவாதங்கள்',
        'description_ta' => 'தேர்தல் பிரச்சாரம் நாடு முழுவதும் தீவிரமடைந்து வரும் நிலையில் முக்கிய கட்சிகள் தங்களது தேர்தல் வாக்குறுதிகளை வெளியிட்டு வருகின்றன.',
        'button_text_ta' => 'தேர்தல் களம்'
    ]
];
$sliderStmt = $pdo->prepare("UPDATE sliders SET title_ta = ?, description_ta = ?, button_text_ta = ? WHERE id = ?");
foreach ($sliderUpdates as $id => $data) {
    $sliderStmt->execute([$data['title_ta'], $data['description_ta'], $data['button_text_ta'], $id]);
    echo "Updated slider #$id\n";
}

echo "\n=== 4. UPDATE NEWS ARTICLES ===\n";
$newsUpdates = [
    1 => [
        'title_ta' => 'மாநில பட்ஜெட் கூட்டத்தொடர்: உள்கட்டமைப்பு மற்றும் நீடித்த வளர்ச்சிக்கான முக்கிய நிதி ஒதுக்கீடுகள்',
        'short_description_ta' => 'தூய குடிநீர், நவீன போக்குவரத்து கட்டமைப்பு மற்றும் கல்வி மேம்பாட்டிற்காக முக்கிய நிதி ஒதுக்கீடுகள் அறிவிக்கப்பட்டுள்ளன.',
        'content_ta' => '<p>சட்டமன்ற பட்ஜெட் கூட்டத்தொடர் மாநிலம் தழுவிய பொது உள்கட்டமைப்பு, இளைஞர் வேலைவாய்ப்பு மற்றும் கல்வி நவீனமயமாக்கல் குறித்த விரிவான விவாதங்களுடன் தொடங்கியது.</p><p>சட்டமன்றத்தில் உரையாற்றிய தலைவர்கள், பொது சுகாதாரம் மற்றும் திறன் மேம்பாட்டு திட்டங்களுக்கு கணிசமான நிதி ஒதுக்கீட்டுடன் அனைத்து பிராந்தியங்களிலும் சமநிலையான பொருளாதார வளர்ச்சியை வலியுறுத்தினர்.</p><p>முக்கிய துறை அமைச்சர்கள் நீடித்த கிராமப்புற வளர்ச்சி திட்டங்கள் குறித்த விரிவான விளக்கங்களை அளித்தனர். சட்டமன்ற கூட்டத்தொடர் இந்த வாரம் முழுவதும் தொடர்ந்து நடைபெறும் என அறிவிக்கப்பட்டுள்ளது.</p>'
    ],
    2 => [
        'title_ta' => 'மாநிலங்களுக்கிடையேயான கவுன்சில் கூட்டம்: வர்த்தக விதிகள் எளிமைப்படுத்தல் மற்றும் வரிச்சலுகை அறிவிப்பு',
        'short_description_ta' => 'உற்பத்தி மற்றும் குறு, சிறு, நடுத்தர தொழில்களின் ஏற்றுமதியை ஊக்குவிக்க எளிய வரி நடைமுறைகளை அமல்படுத்த பிரதிநிதிகள் வலியுறுத்தல்.',
        'content_ta' => '<p>சிறு நிறுவனங்களுக்கான விநியோகச் சங்கிலி மேம்பாடு மற்றும் அரசு நடைமுறைகளை எளிமைப்படுத்துவது தொடர்பாக நிதி அமைச்சர்கள் மற்றும் தொழில் துறை பிரதிநிதிகள் உயர்மட்ட ஆலோசனைக் கூட்டத்தில் பங்கேற்றனர்.</p><p>அத்தியாவசிய விவசாய உபகரணங்கள் மற்றும் சூழலுக்கு உகந்த ஜவுளி உற்பத்தி ஆலைகளுக்கு வரிவிலக்கு கோரி பல்வேறு மாநில பிரதிநிதிகள் திட்டங்களை முன்வைத்தனர்.</p><p>மாநிலங்களுக்கிடையேயான வர்த்தகத்தை ஊக்குவிக்கும் நோக்கில் முன்னோடி சீர்திருத்த நடைமுறைகளுக்கு இக்கவுன்சில் ஒருமனதாக ஒப்புதல் வழங்கியது.</p>'
    ],
    3 => [
        'title_ta' => 'நகர்ப்புற மற்றும் கிராமப்புற நிர்வாக நவீனமயமாக்கல்: புதிய டிஜிட்டல் இணையதளங்கள் அறிமுகம்',
        'short_description_ta' => 'அரசு சேவைகளை உடனுக்குடன் கண்காணிக்கும் வசதி மற்றும் வெளிப்படையான நிர்வாகத்தை உறுதி செய்ய புதிய டிஜிட்டல் தளம்.',
        'content_ta' => '<p>நகராட்சி அனுமதிகள், பயன்பாட்டு சேவைகள் மற்றும் பொதுமக்கள் குறைகேட்பு சேவைகளை விரைவுபடுத்த அதிநவீன டிஜிட்டல் நிர்வாக முறை அதிகாரப்பூர்வமாக தொடங்கப்பட்டுள்ளது.</p><p>பொதுமக்கள் தங்கள் ஸ்மார்ட்போன்கள் மூலமாகவே உள்ளூர் வளர்ச்சி செலவினங்கள் மற்றும் நகர்மன்ற தீர்மானங்களை நேரடியாக கண்காணிக்க முடியும். இதனால் நிர்வாகத்தில் வெளிப்படைத்தன்மையும் மக்கள் பங்களிப்பும் அதிகரிக்கும்.</p>'
    ],
    4 => [
        'title_ta' => 'தொழிற்பூங்காக்கள் விரிவாக்க திட்டம்: பல்லாயிரக்கணக்கான உயர் தொழில்நுட்ப வேலைவாய்ப்புகள் உருவாக்கம்',
        'short_description_ta' => 'சர்வதேச மின்னணு மற்றும் பசுமை போக்குவரத்து உற்பத்தியாளர்களை ஈர்க்க பிரம்மாண்ட தொழில்நுட்ப வழித்தட திட்டத்திற்கு அரசு ஒப்புதல்.',
        'content_ta' => '<p>அதிவேக சரக்கு போக்குவரத்து மற்றும் புதுப்பிக்கத்தக்க எரிசக்தி கட்டமைப்புடன் கூடிய ஐந்து சிறப்பு தொழில் வளர்ச்சி வழித்தடங்களுக்கு அமைச்சரவை முறைப்படி ஒப்புதல் அளித்துள்ளது.</p><p>முன்னணி சர்வதேச தொழில்நுட்ப நிறுவனங்கள் இங்கு உற்பத்தி ஆலைகளை நிறுவ உறுதி அளித்துள்ளன; அடுத்த மூன்று ஆண்டுகளில் 1.5 லட்சத்திற்கும் மேற்பட்ட வேலைவாய்ப்புகள் உருவாகும் என எதிர்பார்க்கப்படுகிறது.</p>'
    ],
    5 => [
        'title_ta' => 'சென்னையில் பிரம்மாண்ட திரை விழா மற்றும் இசை வெளியீடு: ஆயிரக்கணக்கான ரசிகர்கள் உற்சாகம்',
        'short_description_ta' => 'முன்னணி நட்சத்திரங்கள் மற்றும் உலக இசையமைப்பாளர்கள் பங்கேற்க, ஆண்டின் மிகவும் எதிர்பார்க்கப்பட்ட இசை வெளியீட்டு விழா கோலாகலமாக நடைபெற்றது.',
        'content_ta' => '<p>பிரபல திரைப்பட இயக்குநர்கள், புகழ்பெற்ற இசையமைப்பாளர்கள் மற்றும் சினிமா ரசிகர்கள் முன்னிலையில் ஒரு மறக்க முடியாத இசை வெளியீட்டு விழா நடைபெற்றது.</p><p>ஒலி வடிவமைப்பு மற்றும் காட்சியாக்கத்தில் தொழில்நுட்பத்தின் புதிய எல்லைகளை தொட்டுள்ள இப்படம் இரண்டு ஆண்டுகளுக்கும் மேலான தீவிர உழைப்பில் உருவாகியுள்ளது என இயக்குநர் தெரிவித்தார்.</p>'
    ],
    6 => [
        'title_ta' => 'சர்வதேச திரைப்பட விழாவில் தங்க விருது வென்ற சுயாதீன திரைப்படம்: உலகளாவிய பாராட்டு',
        'short_description_ta' => 'ஐரோப்பிய திரைப்பட விழாவில் சிறந்த இயக்குநருக்கான உயரிய தங்க விருதை வென்று உலக அரங்கில் சாதனை படைத்த திரைப்படம்.',
        'content_ta' => '<p>150 சர்வதேச திரைப்படங்களுடன் போட்டியிட்டு, இந்த உணர்வுப்பூர்வமான சுயாதீன திரைப்படம் சர்வதேச திரைப்பட மன்றத்தில் சிறந்த இயக்குநருக்கான தங்கக் கோப்பையை வென்றது.</p><p>திரைப்படத்தின் கதை மற்றும் நுணுக்கமான காட்சிகளை விமர்சகர்கள் வெகுவாகப் பாராட்டி, உலக அரங்கில் பிராந்திய திரைப்படங்களின் புதிய எழுச்சி என்று வாழ்த்தியுள்ளனர்.</p>'
    ],
    7 => [
        'title_ta' => 'டிஜிட்டல் தளங்களில் புதிய சாதனை படைத்த வரலாற்று பிரம்மாண்ட திரைப்பட டீசர்',
        'short_description_ta' => 'கண்கவர் கிராபிக்ஸ் காட்சிகள், பிரம்மாண்ட போர்க்கள வடிவமைப்புடன் வெளியான டீசர் 24 மணி நேரத்தில் 3 கோடிக்கும் அதிகமான பார்வைகளை கடந்தது.',
        'content_ta' => '<p>விரைவில் திரைக்கு வரவிருக்கும் பிரம்மாண்ட வரலாற்று திரைப்படத்தின் அதிகாரப்பூர்வ டீசர் உலகளவில் ரசிகர்களின் கவனத்தை ஈர்த்து சமூக வலைதளங்களில் முதலிடம் பிடித்துள்ளது.</p><p>அதிநவீன CGI தொழில்நுட்பம், வரலாற்று சிறப்புமிக்க உடைகள் மற்றும் பிரம்மாண்ட ஒளிப்பதிவுடன் உருவாகியுள்ள இப்படம் ஐந்து மொழிகளில் உலகளவில் வெளியாகவுள்ளது.</p>'
    ],
    8 => [
        'title_ta' => 'நவீன திரைக்கதை எழுத்தாளர்களின் புதிய அலை: தமிழ் சினிமா கதையாடலில் புதிய பரிமாணம்',
        'short_description_ta' => 'பழைய பாணி மசாலா ஃபார்முலாக்களை விடுத்து ஆழமான கதாபாத்திரங்கள் மற்றும் புதிய திரைக்கதைகளை வரவேற்கும் சமகால திரைப்பட உலகம்.',
        'content_ta' => '<p>சமீபத்திய வெற்றித் திரைப்படங்களை ஆராய்ந்தால், யதார்த்தமான உணர்வுகள் மற்றும் புதிய கண்ணோட்டங்கள் கொண்ட கதைகளே ரசிகர்களை அதிகம் கவருகின்றன என்பது தெளிவாகிறது.</p><p>புதிய சிந்தனை கொண்ட கலைஞர்களின் படைப்புகளுக்கு திரையரங்கு விநியோகஸ்தர்கள் மற்றும் ஓடிடி தளங்களிடையே பெரும் வரவேற்பு காணப்படுகிறது.</p>'
    ]
];

$newsStmt = $pdo->prepare("UPDATE news SET title_ta = ?, short_description_ta = ?, content_ta = ? WHERE id = ?");
foreach ($newsUpdates as $id => $data) {
    $newsStmt->execute([$data['title_ta'], $data['short_description_ta'], $data['content_ta'], $id]);
    echo "Updated news article #$id\n";
}

echo "\n=== 5. UPDATE COMPANY SETTINGS ===\n";
$settingsStmt = $pdo->prepare("UPDATE company_settings SET 
    tagline_ta = ?,
    address_ta = ?,
    footer_text_ta = ?,
    copyright_text_ta = ?
    WHERE id = 1");
$settingsStmt->execute([
    'உலகின் குரல் | சர்வதேச செய்திகள் மற்றும் சுயாதீன இதழியல்',
    'தலைமையகம், அண்ணா சாலை, சென்னை - 600002, தமிழ்நாடு, இந்தியா.',
    'ரிப்போர்ட்டர் வேர்ல்ட் – நம்பகமான முக்கிய செய்திகள், ஆழமான அரசியல் பார்வை, பொழுதுபோக்கு தகவல்கள் மற்றும் உலகளாவிய நேரடி ஆய்வறிக்கைகளை உடனுக்குடன் வழங்குகிறது.',
    '© 2026 Reporter World. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
]);
echo "Updated company settings\n";

echo "\nMigration completed successfully!\n";
