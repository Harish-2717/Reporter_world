// frontend/src/pages/NewsDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, User, Eye, Share2, Copy, Check, 
  ArrowLeft, MessageCircle, Loader2 
} from 'lucide-react';
import { FacebookIcon, TwitterIcon } from '../components/SocialIcons';
import { newsApi, getFullImageUrl } from '../services/api';
import NewsCard from '../components/NewsCard';
import { useLanguage } from '../context/LanguageContext';

export default function NewsDetailPage() {
  const { t, tCategory, tContent, tAuthor, formatDate } = useLanguage();
  const { slug, id } = useParams();
  const articleIdentifier = slug || id;
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!articleIdentifier) return;

    newsApi.getNewsDetail(articleIdentifier)
      .then(res => {
        if (res.data && res.data.success) {
          setNews(res.data.news);
          setRelatedNews(res.data.related_news || []);
        }
      })
      .catch(err => console.error('News detail error:', err))
      .finally(() => setLoading(false));
  }, [articleIdentifier]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1.5rem', color: 'var(--primary-red)' }} />
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>{t('loading_news')}</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>{t('news_not_found')}</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>{t('news_not_found_desc')}</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={18} /> {t('go_to_homepage')}
        </Link>
      </div>
    );
  }

  const title = tContent(news, 'title', news.title);
  const shortDesc = tContent(news, 'short_description', news.short_description);
  const contentHtml = tContent(news, 'content', news.content);
  const authorName = tAuthor(news.author);
  const currentUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(title);
  const imageUrl = getFullImageUrl(news.image, '/placeholder-news.svg');
  const categoryName = tCategory({ 
    slug: news.category_slug, 
    name: news.category_name, 
    name_ta: news.category_name_ta 
  });

  return (
    <article className="news-detail-container container">
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link 
          to={news.category_slug === 'politics' ? '/politics' : (news.category_slug === 'cinema' ? '/cinema' : '/')} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> {t('back_to')} {categoryName || t('home')}
        </Link>
      </div>

      {/* Header */}
      <header className="news-detail-header">
        <span className="news-detail-badge">
          {categoryName}
        </span>

        <h1 className="news-detail-title">{title}</h1>

        <div className="news-detail-meta">
          <span>
            <Calendar size={16} /> {formatDate(news.published_at, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
          </span>
          {news.author && (
            <span>
              <User size={16} /> {t('reporter_label')} {authorName}
            </span>
          )}
          {news.views !== undefined && (
            <span>
              <Eye size={16} /> {news.views} {t('views_label')}
            </span>
          )}
        </div>
      </header>

      {/* Main Image */}
      <div className="news-detail-main-img-wrap">
        <img 
          src={imageUrl} 
          alt={title} 
          className="news-detail-main-img" 
        />
      </div>

      {/* Short Description Lead paragraph */}
      {shortDesc && (
        <div style={{ 
          fontSize: '1.25rem', 
          fontWeight: 600, 
          color: '#334155', 
          lineHeight: 1.7, 
          borderLeft: '4px solid var(--primary-red)', 
          paddingLeft: '1.25rem',
          margin: '1.75rem 0'
        }}>
          {shortDesc}
        </div>
      )}

      {/* Full Formatted News Content */}
      <div 
        className="news-detail-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Social Sharing Buttons */}
      <div className="social-share-box">
        <div className="share-title">
          <Share2 size={18} color="var(--primary-red)" />
          {t('share_this_news')}
        </div>

        <div className="share-buttons">
          {/* WhatsApp */}
          <a 
            href={`https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`} 
            target="_blank" 
            rel="noreferrer"
            className="share-btn whatsapp"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle size={20} />
          </a>

          {/* Facebook */}
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} 
            target="_blank" 
            rel="noreferrer"
            className="share-btn facebook"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <FacebookIcon size={18} />
          </a>

          {/* Twitter / X */}
          <a 
            href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTitle}`} 
            target="_blank" 
            rel="noreferrer"
            className="share-btn twitter"
            title="Share on Twitter"
            aria-label="Share on Twitter"
          >
            <TwitterIcon size={18} />
          </a>

          {/* Copy Link */}
          <button 
            type="button" 
            onClick={handleCopyLink} 
            className="share-btn copy-link"
            title="Copy URL"
            aria-label="Copy URL"
          >
            {copied ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="related-news-section" style={{ marginTop: '4rem' }}>
          <div className="related-news-header">
            <h2 className="related-title" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {t('related_news')}
            </h2>
          </div>

          <div className="news-cards-grid">
            {relatedNews.map(item => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
