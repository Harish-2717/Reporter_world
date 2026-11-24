// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useLanguage } from './context/LanguageContext';

// Public Pages
import HomePage from './pages/HomePage';
import PoliticsPage from './pages/PoliticsPage';
import CinemaPage from './pages/CinemaPage';
import CategoryPage from './pages/CategoryPage';
import NewsDetailPage from './pages/NewsDetailPage';

// Admin CMS Pages
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import LogoManagement from './admin/LogoManagement';
import CategoryManagement from './admin/CategoryManagement';
import NewsManagement from './admin/NewsManagement';
import SliderManagement from './admin/SliderManagement';
import CompanySettings from './admin/CompanySettings';

// Public Layout Wrapper
function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// 404 Page — translated
function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>
        {t('page_not_found')}
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        {t('page_not_found_desc')}
      </p>
      <Link to="/" className="btn-primary">{t('go_to_homepage')}</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/politics" element={<PoliticsPage />} />
        <Route path="/cinema" element={<CinemaPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/news/id/:id" element={<NewsDetailPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin CMS (Protected Layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="logo" element={<LogoManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="sliders" element={<SliderManagement />} />
        <Route path="settings" element={<CompanySettings />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
