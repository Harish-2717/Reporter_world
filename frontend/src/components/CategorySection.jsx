// frontend/src/components/CategorySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NewsCard from './NewsCard';
import { useLanguage } from '../context/LanguageContext';

export default function CategorySection({ 
  title, 
  categorySlug, 
  newsList = [], 
  viewAllLink, 
  viewAllText,
  isCinema = false,
  loading = false
}) {
  const { t, tCategory } = useLanguage();

  const displayTitle = title || (categorySlug ? tCategory(categorySlug) : '');

  const defaultViewAll = categorySlug === 'politics'
    ? t('view_all_politics')
    : (categorySlug === 'cinema' ? t('view_all_cinema') : t('view_all_news'));

  return (
    <section className="category-block">
      <div className="category-block-header">
        <div className="cat-title-wrap">
          <div className={`cat-accent-bar ${isCinema ? 'cinema' : ''}`}></div>
          <h2 className="cat-title">{displayTitle}</h2>
        </div>

        {viewAllLink && (
          <Link to={viewAllLink} className={`view-all-btn ${isCinema ? 'cinema' : ''}`}>
            {viewAllText || defaultViewAll} <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#64748b' }}>
          {t('loading_news')}
        </div>
      ) : newsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#94a3b8' }}>
          {t('no_news_category')}
        </div>
      ) : (
        <div className="news-cards-grid">
          {newsList.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </section>
  );
}
