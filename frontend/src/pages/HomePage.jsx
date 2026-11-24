// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import CategorySection from '../components/CategorySection';
import { newsApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [politicsNews, setPoliticsNews] = useState([]);
  const [cinemaNews, setCinemaNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      newsApi.getNews({ category: 'politics', limit: 4 }),
      newsApi.getNews({ category: 'cinema', limit: 4 })
    ])
      .then(([polRes, cinRes]) => {
        if (polRes.data && polRes.data.success) {
          setPoliticsNews(polRes.data.news || []);
        }
        if (cinRes.data && cinRes.data.success) {
          setCinemaNews(cinRes.data.news || []);
        }
      })
      .catch(err => console.error('Error fetching home data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page-wrap">
      <div className="container">
        {/* TOP HERO SHOWCASE */}
        <HeroSlider />

        {/* MAIN NEWS SECTIONS */}
        <main className="live-news-main-section">
          {/* POLITICS SECTION */}
          <CategorySection 
            title={t('politics_news')}
            categorySlug="politics"
            newsList={politicsNews}
            viewAllLink="/politics"
            viewAllText={t('view_all_politics')}
            loading={loading}
          />

          {/* CINEMA SECTION */}
          <CategorySection 
            title={t('cinema_news')}
            categorySlug="cinema"
            newsList={cinemaNews}
            viewAllLink="/cinema"
            viewAllText={t('view_all_cinema')}
            isCinema={true}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
}
