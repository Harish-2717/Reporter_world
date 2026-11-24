// frontend/src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  translations, 
  categoryTranslations, 
  authorTranslations, 
  contentTranslations, 
  sliderTranslations 
} from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('reporter_world_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('reporter_world_lang', lang);
    document.documentElement.lang = lang;
    if (lang === 'ta') {
      document.documentElement.classList.add('lang-ta');
      document.body.classList.add('lang-ta');
    } else {
      document.documentElement.classList.remove('lang-ta');
      document.body.classList.remove('lang-ta');
    }
  }, [lang]);

  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'ta') {
      setLang(newLang);
    }
  };

  // UI Translation helper
  const t = (key, fallback = '') => {
    if (!key) return fallback;
    if (translations[lang] && translations[lang][key] !== undefined) {
      return translations[lang][key];
    }
    if (translations['en'] && translations['en'][key] !== undefined) {
      return translations['en'][key];
    }
    return fallback || key;
  };

  // Category name translation helper
  const tCategory = (categoryObjOrSlug, defaultName = '') => {
    if (!categoryObjOrSlug) return defaultName || '';

    let slug = '';
    let name = defaultName || '';
    let nameTa = '';

    if (typeof categoryObjOrSlug === 'object') {
      slug = categoryObjOrSlug.slug || '';
      name = categoryObjOrSlug.name || defaultName || '';
      nameTa = categoryObjOrSlug.name_ta || '';
    } else {
      slug = String(categoryObjOrSlug).toLowerCase();
    }

    const slugKey = slug ? slug.toLowerCase() : '';

    if (lang === 'ta') {
      if (nameTa && nameTa.trim()) return nameTa;
      if (slugKey && categoryTranslations[slugKey] && categoryTranslations[slugKey].ta) {
        return categoryTranslations[slugKey].ta;
      }
      return name || defaultName || slug;
    } else {
      if (name && name.trim()) return name;
      if (slugKey && categoryTranslations[slugKey] && categoryTranslations[slugKey].en) {
        return categoryTranslations[slugKey].en;
      }
      return nameTa || defaultName || slug;
    }
  };

  // Dynamic news/content field translation helper with robust fallback
  const tContent = (item, field = 'title', fallback = '') => {
    if (!item) return fallback || '';

    const taField = `${field}_ta`;
    const enVal = item[field];
    const taVal = item[taField];

    if (lang === 'ta') {
      // 1. Direct DB translation
      if (taVal && typeof taVal === 'string' && taVal.trim() !== '') {
        return taVal;
      }

      // 2. Check dictionary fallback by slug (news)
      const slug = item.slug;
      if (slug && contentTranslations[slug] && contentTranslations[slug][field]) {
        return contentTranslations[slug][field];
      }

      // 3. Check slider dictionary fallback by original title
      const origTitle = item.title;
      if (origTitle && sliderTranslations[origTitle] && sliderTranslations[origTitle][field]) {
        return sliderTranslations[origTitle][field];
      }

      // 4. Fallback to English version (guarantees no null / undefined / blank)
      if (enVal && typeof enVal === 'string' && enVal.trim() !== '') {
        return enVal;
      }

      return fallback || '';
    } else {
      // English mode
      if (enVal && typeof enVal === 'string' && enVal.trim() !== '') {
        return enVal;
      }
      // If English value is missing, fall back to Tamil value
      if (taVal && typeof taVal === 'string' && taVal.trim() !== '') {
        return taVal;
      }
      return fallback || '';
    }
  };

  // Author role translator
  const tAuthor = (authorName, fallback = '') => {
    if (!authorName) return fallback || '';
    if (lang === 'ta') {
      return authorTranslations[authorName] || authorName;
    }
    return authorName;
  };

  // Settings field translator
  const tSettings = (settingsObj, field, fallback = '') => {
    if (!settingsObj) return fallback || '';
    const taField = `${field}_ta`;
    if (lang === 'ta') {
      if (settingsObj[taField] && typeof settingsObj[taField] === 'string' && settingsObj[taField].trim() !== '') {
        return settingsObj[taField];
      }
      return settingsObj[field] || fallback || '';
    }
    return settingsObj[field] || settingsObj[taField] || fallback || '';
  };

  // Locale-aware date formatter
  const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      if (isNaN(date.getTime())) return dateString;
      const locale = lang === 'ta' ? 'ta-IN' : 'en-US';
      const defaultOpts = options.weekday 
        ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', ...options }
        : { year: 'numeric', month: 'short', day: 'numeric', ...options };
      return date.toLocaleDateString(locale, defaultOpts);
    } catch {
      return dateString;
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang: changeLanguage, 
      t, 
      tCategory, 
      tContent, 
      tAuthor, 
      tSettings, 
      formatDate 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
