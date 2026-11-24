// frontend/src/components/LanguageSwitcher.jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`lang-switcher-wrap ${compact ? 'compact' : ''}`}>
      <Globe size={compact ? 14 : 16} className="lang-globe-icon" />
      <div className="lang-switcher-btn-group">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          title="Switch to English"
          aria-label="Switch to English"
        >
          EN
        </button>
        <span className="lang-divider">|</span>
        <button
          type="button"
          onClick={() => setLang('ta')}
          className={`lang-btn ${lang === 'ta' ? 'active' : ''}`}
          title="தமிழுக்கு மாறவும்"
          aria-label="Switch to Tamil"
        >
          தமிழ்
        </button>
      </div>
    </div>
  );
}
