// frontend/src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from './SocialIcons';
import { newsApi, getFullImageUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, tCategory, tSettings, lang } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    newsApi.getSettings()
      .then(res => {
        if (res.data && res.data.success) {
          setSettings(res.data.settings);
        }
      })
      .catch(err => console.error('Footer settings fetch error:', err));

    newsApi.getCategories()
      .then(res => {
        if (res.data && res.data.success) {
          setCategories(res.data.categories || []);
        }
      })
      .catch(err => console.error('Footer categories fetch error:', err));
  }, []);

  const logoUrl = (settings && settings.logo) ? getFullImageUrl(settings.logo) : null;
  const addressText = tSettings(settings, 'address', settings?.address || '');
  const footerDesc = tSettings(settings, 'footer_text', t('footer_desc'));
  const tagline = tSettings(settings, 'tagline', t('tagline'));
  const copyrightText = tSettings(settings, 'copyright_text', t('copyright_text'));

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & About */}
          <div>
            {logoUrl && settings?.is_logo_active ? (
              <img 
                src={logoUrl} 
                alt="Reporter World" 
                className="footer-brand-logo"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : null}

            <div className="brand-title" style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '0.4rem' }}>
              REPORTER <span style={{ color: 'var(--primary-red)' }}>WORLD</span>
            </div>
            <div style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>
              {tagline}
            </div>

            <p className="footer-desc">
              {footerDesc}
            </p>

            <div className="top-social-links" style={{ gap: '1rem' }}>
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="top-social-icon" title="Facebook" aria-label="Facebook">
                  <FacebookIcon size={20} />
                </a>
              )}
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="top-social-icon" title="Instagram" aria-label="Instagram">
                  <InstagramIcon size={20} />
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noreferrer" className="top-social-icon" title="YouTube" aria-label="YouTube">
                  <YoutubeIcon size={20} />
                </a>
              )}
              {settings?.twitter && (
                <a href={settings.twitter} target="_blank" rel="noreferrer" className="top-social-icon" title="Twitter" aria-label="Twitter">
                  <TwitterIcon size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="footer-heading">{t('quick_links')}</h3>
            <ul className="footer-links-list">
              <li>
                <Link to="/" className="footer-link">
                  <ChevronRight size={14} /> {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/politics" className="footer-link">
                  <ChevronRight size={14} /> {t('politics')}
                </Link>
              </li>
              <li>
                <Link to="/cinema" className="footer-link">
                  <ChevronRight size={14} /> {t('cinema')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: News Categories */}
          <div>
            <h3 className="footer-heading">{t('news_categories')}</h3>
            <ul className="footer-links-list">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link 
                    to={cat.slug === 'politics' ? '/politics' : (cat.slug === 'cinema' ? '/cinema' : `/category/${cat.slug}`)} 
                    className="footer-link"
                  >
                    <ChevronRight size={14} /> {tCategory(cat, cat.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h3 className="footer-heading">{t('contact_us')}</h3>
            {addressText && (
              <div className="footer-contact-item">
                <MapPin size={18} />
                <span>{addressText}</span>
              </div>
            )}
            {settings?.phone && (
              <div className="footer-contact-item">
                <Phone size={18} />
                <a href={`tel:${settings.phone}`} style={{ color: 'inherit' }}>{settings.phone}</a>
              </div>
            )}
            {settings?.email && (
              <div className="footer-contact-item">
                <Mail size={18} />
                <a href={`mailto:${settings.email}`} style={{ color: 'inherit' }}>{settings.email}</a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="footer-bottom">
          <div>
            {copyrightText}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b' }}>
            <span>{t('digital_news_portal')}</span>
            <span>{t('rest_api_powered')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
