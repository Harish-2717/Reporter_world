// frontend/src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { newsApi } from '../services/api';
import { Globe, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryPage() {
  const { t, tCategory } = useLanguage();
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNewsList([]);
    setPage(1);

    // Fetch news by slug
    newsApi.getNews({ category: slug, page: 1, limit: 9 })
      .then(res => {
        if (res.data && res.data.success) {
          const items = res.data.news || [];
          setNewsList(items);
          setTotalPages(res.data.total_pages || 1);
          if (items.length > 0) {
            setCategory({ 
              name: items[0].category_name, 
              name_ta: items[0].category_name_ta, 
              slug: items[0].category_slug 
            });
          } else {
            setCategory({ name: slug, slug });
          }
        }
      })
      .catch(err => console.error('Category news error:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLoadMore = () => {
    if (page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    newsApi.getNews({ category: slug, page: nextPage, limit: 9 })
      .then(res => {
        if (res.data && res.data.success) {
          setNewsList(prev => [...prev, ...(res.data.news || [])]);
          setPage(nextPage);
        }
      })
      .catch(err => console.error('Load more error:', err))
      .finally(() => setLoadingMore(false));
  };

  const categoryName = category ? tCategory(category, category.name) : tCategory(slug, slug);

  return (
    <div className="category-page">
      <div className="dedicated-page-header">
        <div className="container">
          <h1 className="page-header-title">
            <Globe size={36} color="var(--primary-red)" />
            {categoryName}
          </h1>
          <p className="page-header-desc">
            {t('category_desc')}
          </p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
            <p>{t('loading_news')}</p>
          </div>
        ) : (
          <div className="category-block" style={{ padding: '2rem 1.5rem' }}>
            {newsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                {t('no_category_news')}
              </div>
            ) : (
              <div className="news-cards-grid">
                {newsList.map(item => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            )}

            {page < totalPages && (
              <div className="load-more-wrap">
                <button 
                  className="load-more-btn" 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? t('loading_more') : t('load_more_news')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
