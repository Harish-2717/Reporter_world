// frontend/src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from './SocialIcons';
import { newsApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t, tCategory, tContent, formatDate } = useLanguage();
  const [logoData, setLogoData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [latestNewsItem, setLatestNewsItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    // 1. Fetch Logo & Settings
    newsApi.getLogo()
      .then(res => {
        if (res.data && res.data.success) {
          setLogoData(res.data);
        }
      })
      .catch(err => console.error('Logo fetch error:', err));

    // 2. Fetch Active Categories
    newsApi.getCategories()
      .then(res => {
        if (res.data && res.data.success) {
          setCategories(res.data.categories || []);
        }
      })
      .catch(err => console.error('Categories fetch error:', err));

    // 3. Fetch Latest Breaking Headline
    newsApi.getNews({ limit: 1 })
      .then(res => {
        if (res.data && res.data.news && res.data.news.length > 0) {
          setLatestNewsItem(res.data.news[0]);
        }
      })
      .catch(err => console.error('Breaking news fetch error:', err));
  }, []);

  useEffect(() => {
    setCurrentDateStr(formatDate(new Date().toISOString(), { weekday: 'long' }));
  }, [formatDate]);

  // Filter extra categories (other than politics & cinema)
  const otherCategories = categories.filter(
    c => c.slug !== 'politics' && c.slug !== 'cinema'
  );

  const breakingTitle = latestNewsItem
    ? tContent(latestNewsItem, 'title', latestNewsItem.title)
    : t('default_ticker');

  return (
    <header>
      {/* Top Bar with Live Indicator, Language Switcher & Date */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="live-ticker-wrap">
            <span className="live-badge">
              <span className="live-dot"></span> {t('live')}
            </span>
            <span className="ticker-text">
              {breakingTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Language Switcher in Top Bar */}
            <LanguageSwitcher />

            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {currentDateStr}
            </span>
            <div className="top-social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="top-social-icon" title="Facebook" aria-label="Facebook">
                <FacebookIcon size={15} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="top-social-icon" title="Instagram" aria-label="Instagram">
                <InstagramIcon size={15} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="top-social-icon" title="YouTube" aria-label="YouTube">
                <YoutubeIcon size={15} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="top-social-icon" title="Twitter" aria-label="Twitter">
                <TwitterIcon size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header with Logo & Nav */}
      <div className="main-header">
        <div className="container header-inner">
          {/* Logo Section */}
          <Link to="/" className="brand-logo-link" title={`Reporter World – ${t('home')}`}>
            {logoData && logoData.is_logo_active && logoData.logo_url ? (
              <img 
                src={logoData.logo_url} 
                alt="Reporter World – Voice of the World" 
                className="brand-logo-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackEl = document.getElementById('brand-text-fallback');
                  if (fallbackEl) fallbackEl.style.display = 'flex';
                }}
              />
            ) : null}

            {/* Fallback branded text */}
            <div 
              id="brand-text-fallback" 
              className="brand-text-fallback"
              style={{ display: (logoData && logoData.is_logo_active && logoData.logo_url) ? 'none' : 'flex' }}
            >
              <div className="brand-title">
                REPORTER <span>WORLD</span>
              </div>
              <div className="brand-tagline">{t('tagline')}</div>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ul className="navbar-nav">
              <li>
                <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('home')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/politics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('politics')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/cinema" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {t('cinema')}
                </NavLink>
              </li>

              {/* Dynamic Categories Dropdown */}
              {otherCategories.length > 0 && (
                <li style={{ position: 'relative' }}>
                  <div className="nav-link" style={{ cursor: 'pointer' }}>
                    {t('more_categories')} <ChevronDown size={14} />
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    minWidth: '180px',
                    padding: '0.5rem 0',
                    zIndex: 50
                  }}>
                    {otherCategories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/category/${cat.slug}`}
                        style={{
                          display: 'block',
                          padding: '0.5rem 1rem',
                          color: '#1e293b',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        {tCategory(cat, cat.name)}
                      </Link>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Actions (Language Switcher + Menu Trigger) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="mobile-only-lang">
              <LanguageSwitcher compact={true} />
            </div>
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle navigation"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <div className="brand-title" style={{ fontSize: '1.4rem' }}>
              REPORTER <span>WORLD</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              aria-label="Close navigation"
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <LanguageSwitcher />
          </div>

          <div className="mobile-nav-links">
            <NavLink 
              to="/" 
              end 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </NavLink>
            <NavLink 
              to="/politics" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('politics')}
            </NavLink>
            <NavLink 
              to="/cinema" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('cinema')}
            </NavLink>

            {otherCategories.map(cat => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {tCategory(cat, cat.name)}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
