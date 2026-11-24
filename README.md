# Reporter World – Voice of the World

A modern, responsive bilingual news publishing portal and content management system built with React, Vite, PHP, and MySQL.

---

## 🌟 Features

- **Bilingual Support**: Full English and Tamil (தமிழ்) coverage for news articles, categories, and headlines.
- **Dynamic Frontend**: Modern React SPA powered by Vite, Tailwind CSS, Lucide icons, and responsive layouts.
- **Breaking News Ticker**: Real-time breaking news updates.
- **Category Showcase**: Politics, World, Technology, Business, Sports, Entertainment, Lifestyle, and more.
- **RESTful PHP Backend**: Clean PHP API with PDO for database operations and structured JSON endpoints.
- **Admin Dashboard**: Manage news, categories, sliders, logos, and company settings.
- **SEO & Social Sharing Ready**: OpenGraph meta tags, Twitter cards, and structured schema.

---

## 🏗️ Project Architecture

```
Reporter World/
├── api/                  # PHP REST API backend
│   ├── auth/             # Authentication & admin login
│   ├── categories/       # Category management endpoints
│   ├── config/           # Database configuration
│   ├── dashboard/        # Dashboard metrics & analytics
│   ├── logo/             # Logo management
│   ├── news/             # News CRUD and query endpoints
│   ├── settings/         # Company and general settings
│   ├── sliders/          # Featured sliders API
│   └── uploads/          # Media & uploaded assets
├── frontend/             # React + Vite single-page application
│   ├── src/              # Components, contexts, pages, & services
│   ├── package.json      # Frontend npm dependencies
│   └── vite.config.js    # Vite configuration & dev proxy
├── dist/                 # Production SPA build output
├── public/               # Public static assets
├── database.sql          # MySQL database schema and seed data
├── index.php             # Main entry point (serves SPA)
├── .env.example          # Environment configuration template
└── .htaccess             # Apache URL rewriting & CORS rules
```

---

## 🚀 Getting Started

### Prerequisites

- **PHP**: >= 7.4 (PHP 8.x recommended)
- **MySQL / MariaDB**: >= 5.7
- **Node.js**: >= 18.x (for frontend development and building)
- **Web Server**: Apache (XAMPP, WampServer, or standalone) with `mod_rewrite` enabled

---

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Harish-2717/Reporter_world.git
   cd Reporter_world
   ```

2. **Database Setup**
   - Start Apache and MySQL in XAMPP.
   - Open phpMyAdmin (`http://localhost/phpmyadmin`).
   - Create a database named `reporter_world_db` (or import directly from `database.sql`).
   - Import `database.sql` into the database.

3. **Configure Environment**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update database credentials if different from defaults (`root` / no password):
     ```env
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_NAME=reporter_world_db
     DB_USER=root
     DB_PASS=
     ```

4. **Frontend Development & Build**
   - Install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Start development server:
     ```bash
     npm run dev
     ```
   - Build for production:
     ```bash
     npm run build
     ```
     *(This outputs the built production SPA directly to `../dist`)*

5. **Access the Application**
   - Main Portal: `http://localhost/Reporter%20World`
   - Admin Login: `http://localhost/Reporter%20World/admin/login` (Default credentials in `database.sql`)

---

## 📄 License

This project is open-source.
