// frontend/src/components/NewsCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, User } from 'lucide-react';
import { getFullImageUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function NewsCard({ news }) {
  const { t, tCategory, tContent, tAuthor, formatDate } = useLanguage();

  if (!news) return null;

  const isPolitics = news.category_slug === 'politics';
  const isCinema = news.category_slug === 'cinema';

  const badgeClass = isPolitics ? 'politics' : (isCinema ? 'cinema' : '');
  const imageUrl = getFullImageUrl(news.image, '');
  const newsUrl = `/news/${news.slug || news.id}`;

  const title = tContent(news, 'title', news.title);
  const shortDescription = tContent(news, 'short_description', news.short_description);
  const authorName = tAuthor(news.author);
  const categoryDisplayName = tCategory({
    slug: news.category_slug,
    name: news.category_name,
    name_ta: news.category_name_ta
  });

  return (
    <article className="news-card">
      <Link to={newsUrl} className="news-card-img-wrap" tabIndex={-1}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="news-card-img" 
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add('news-card-img-fallback');
              }
            }}
          />
        ) : (
          <div className="news-card-img-fallback"></div>
        )}
        {categoryDisplayName && (
          <span className={`news-card-badge ${badgeClass}`}>
            {categoryDisplayName}
          </span>
        )}
      </Link>

      <div className="news-card-body">
        <div className="news-card-meta">
          <span>
            <Calendar size={13} /> {formatDate(news.published_at)}
          </span>
          {news.author && (
            <span>
              <User size={13} /> {authorName}
            </span>
          )}
        </div>

        <Link to={newsUrl} className="news-card-title-link">
          <h3 className="news-card-title">{title}</h3>
        </Link>

        {shortDescription && (
          <p className="news-card-desc">{shortDescription}</p>
        )}

        <div className="news-card-footer">
          <Link to={newsUrl} className="read-more-link">
            {t('read_full_story')} <ArrowRight size={14} />
          </Link>

          {news.views !== undefined && (
            <span className="card-views-badge" title={t('views_label')}>
              <Eye size={13} /> {news.views}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
