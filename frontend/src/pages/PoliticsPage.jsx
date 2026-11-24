// frontend/src/pages/PoliticsPage.jsx
import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { newsApi } from '../services/api';
import { Landmark, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PoliticsPage() {
  const { t } = useLanguage();
  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNews = (targetPage, append = false) => {
    if (targetPage === 1) setLoading(true);
    else setLoadingMore(true);

    newsApi.getNews({ category: 'politics', page: targetPage, limit: 9 })
      .then(res => {
        if (res.data && res.data.success) {
          const items = res.data.news || [];
          if (append) {
            setNewsList(prev => [...prev, ...items]);
          } else {
            setNewsList(items);
          }
          setTotalPages(res.data.total_pages || 1);
          setPage(targetPage);
        }
      })
      .catch(err => console.error('Politics news fetch error:', err))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    fetchNews(1, false);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchNews(page + 1, true);
    }
  };

  return (
    <div className="category-dedicated-page politics-page">
      {/* Header Banner */}
      <div className="dedicated-page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="page-header-badge politics">
              <Landmark size={15} /> {t('politics_badge')}
            </span>
            <h1 className="page-header-title">{t('politics_news')}</h1>
            <p className="page-header-desc">
              {t('politics_desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="section-loading-wrap">
            <Loader2 size={36} className="animate-spin" />
            <p>{t('loading_news')}</p>
          </div>
        ) : (
          <section className="category-block" style={{ padding: '2rem 1.5rem' }}>
            <div className="category-block-header">
              <div className="cat-title-wrap">
                <div className="cat-accent-bar"></div>
                <h2 className="cat-title">{t('latest_political_coverage')}</h2>
              </div>
              <span className="cat-count-badge">{newsList.length} {t('articles')}</span>
            </div>

            {newsList.length === 0 ? (
              <div className="empty-news-state">
                {t('no_politics_news')}
              </div>
            ) : (
              <div className="news-cards-grid">
                {newsList.map(item => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {page < totalPages && (
              <div className="load-more-wrap">
                <button 
                  className="load-more-btn" 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> {t('loading_more')}
                    </>
                  ) : (
                    t('load_more_news')
                  )}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
