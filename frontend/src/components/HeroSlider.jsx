// frontend/src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { newsApi, getFullImageUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSlider() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi.getSliders()
      .then(res => {
        if (res.data && res.data.success) {
          setSliders(res.data.sliders || []);
        }
      })
      .catch(err => console.error('Error fetching sliders:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="hero-showcase-loading">
        <div className="skeleton-hero-card"></div>
      </div>
    );
  }

  if (sliders.length === 0) {
    return null;
  }

  const mainStory = sliders[0];
  const sideStories = sliders.slice(1, 3);

  return (
    <section className="hero-showcase-section">
      {sliders.length === 1 ? (
        <div className="hero-single-wrap">
          <HeroMainCard item={mainStory} isFullWidth={true} />
        </div>
      ) : (
        <div className="hero-grid-layout">
          <div className="hero-main-col">
            <HeroMainCard item={mainStory} />
          </div>
          {sideStories.length > 0 && (
            <div className="hero-side-col">
              {sideStories.map((item, idx) => (
                <HeroSideCard key={item.id || idx} item={item} index={idx + 2} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// Main Featured Hero Card
function HeroMainCard({ item, isFullWidth = false }) {
  const { t, tContent } = useLanguage();
  if (!item) return null;
  const imageUrl = getFullImageUrl(item.image, '/placeholder-slider.svg');
  const targetLink = item.link || `/`;

  const title = tContent(item, 'title', item.title);
  const description = tContent(item, 'description', item.description);
  const btnLabel = tContent(item, 'button_text', t('read_full_story'));

  return (
    <div className={`hero-main-card ${isFullWidth ? 'full-width' : ''}`}>
      <img
        src={imageUrl}
        alt={title}
        className="hero-card-bg-img"
        loading="eager"
      />
      <div className="hero-card-overlay"></div>

      <div className="hero-card-content">
        <div className="hero-badge-wrap">
          <span className="hero-lead-badge">
            <Flame size={14} /> {t('top_story')}
          </span>
        </div>

        <Link to={targetLink}>
          <h2 className="hero-main-title">{title}</h2>
        </Link>

        {description && (
          <p className="hero-main-desc">{description}</p>
        )}

        <div className="hero-card-actions">
          <Link to={targetLink} className="hero-read-btn">
            {btnLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Side Column Secondary Story Cards
function HeroSideCard({ item, index }) {
  const { t, tContent } = useLanguage();
  if (!item) return null;
  const imageUrl = getFullImageUrl(item.image, '/placeholder-slider.svg');
  const targetLink = item.link || `/`;

  const title = tContent(item, 'title', item.title);
  const btnLabel = tContent(item, 'button_text', t('read_story'));

  return (
    <div className="hero-side-card">
      <img
        src={imageUrl}
        alt={title}
        className="hero-card-bg-img"
        loading="lazy"
      />
      <div className="hero-card-overlay"></div>

      <div className="hero-side-content">
        <span className="hero-side-badge">
          <Sparkles size={12} /> {t('spotlight')} #{index}
        </span>

        <Link to={targetLink}>
          <h3 className="hero-side-title">{title}</h3>
        </Link>

        <Link to={targetLink} className="hero-side-link">
          {btnLabel} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
