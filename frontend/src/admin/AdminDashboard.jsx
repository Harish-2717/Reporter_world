// frontend/src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Landmark, Film, Sliders, 
  PlusCircle, Eye, Edit, Trash2, Loader2, ExternalLink,
  ArrowRight, Layers, CheckCircle2, Clock
} from 'lucide-react';
import { newsApi, getFullImageUrl } from '../services/api';

function ArticleAvatar({ image, title, categorySlug }) {
  const [error, setError] = useState(false);
  const initials = (categorySlug ? categorySlug.substring(0, 2) : (title ? title.substring(0, 2) : 'RW')).toUpperCase();

  if (!image || error) {
    return (
      <div className={`article-avatar category-avatar-${categorySlug || 'default'}`}>
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div className="article-avatar">
      <img 
        src={getFullImageUrl(image)} 
        alt="" 
        onError={() => setError(true)} 
      />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_news: 0,
    politics_news: 0,
    cinema_news: 0,
    total_categories: 0,
    active_sliders: 0,
    total_views: 0
  });
  const [recentNews, setRecentNews] = useState([]);
  const [recentSliders, setRecentSliders] = useState([]);
  const [categoriesOverview, setCategoriesOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    newsApi.getDashboardStats()
      .then(res => {
        if (res.data && res.data.success) {
          setStats(res.data.stats || {});
          setRecentNews(res.data.recent_news || []);
          setRecentSliders(res.data.recent_sliders || []);
          setCategoriesOverview(res.data.categories_overview || []);
        }
      })
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this news article?')) return;
    try {
      await newsApi.deleteNews(id);
      fetchStats();
    } catch (err) {
      alert('Error deleting the news article. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <Loader2 size={36} className="animate-spin" style={{ color: '#0d1f18', marginBottom: '1rem' }} />
        <p style={{ fontFamily: "'Cinzel', serif", letterSpacing: '1px', fontWeight: 600 }}>
          SYNCHRONIZING REPOSITORY...
        </p>
      </div>
    );
  }

  return (
    <div className="overview-container">
      {/* Overview Top Header (Matching Image 2) */}
      <div className="overview-header-row">
        <div>
          <h1 className="overview-main-title">
            OVERVIEW DASHBOARD
          </h1>
          <p className="overview-main-subtitle">
            Real-time metrics, recent submissions, and quick action logs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="overview-header-actions">
          <Link to="/admin/news" className="btn-forest-primary">
            <PlusCircle size={16} />
            <span>Add News</span>
          </Link>
          <Link to="/admin/sliders" className="btn-forest-secondary">
            <Sliders size={16} />
            <span>Add Slider</span>
          </Link>
          <Link to="/" target="_blank" rel="noreferrer" className="btn-forest-outline">
            <span>Live Site</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards Row (Exact Image 2 Style) */}
      <div className="overview-stats-grid">
        {/* Total News */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">TOTAL NEWS</span>
            <div className="metric-icon-badge blue">
              <FileText size={20} />
            </div>
          </div>
          <div className="metric-number">{stats.total_news}</div>
          <div className="metric-sublabel">Published articles</div>
        </div>

        {/* Politics News */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">POLITICS NEWS</span>
            <div className="metric-icon-badge orange">
              <Landmark size={20} />
            </div>
          </div>
          <div className="metric-number">{stats.politics_news}</div>
          <div className="metric-sublabel">Governance & policy</div>
        </div>

        {/* Cinema News */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">CINEMA NEWS</span>
            <div className="metric-icon-badge green">
              <Film size={20} />
            </div>
          </div>
          <div className="metric-number">{stats.cinema_news}</div>
          <div className="metric-sublabel">Entertainment beat</div>
        </div>

        {/* Active Sliders */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">ACTIVE SLIDERS</span>
            <div className="metric-icon-badge purple">
              <Sliders size={20} />
            </div>
          </div>
          <div className="metric-number">{stats.active_sliders}</div>
          <div className="metric-sublabel">Homepage hero banners</div>
        </div>
      </div>

      {/* Dual Column Layout (Exact Image 2 Style) */}
      <div className="overview-dual-grid">
        {/* Left Column: Recent News Articles */}
        <div className="overview-card">
          <div className="overview-card-header">
            <h2 className="overview-card-title">RECENT ARTICLES</h2>
            <Link to="/admin/news" className="overview-card-link">
              <span>ALL ARTICLES</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="overview-table">
              <thead>
                <tr>
                  <th>ARTICLE</th>
                  <th>CATEGORY</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {recentNews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-cell">
                      No news articles published yet.
                    </td>
                  </tr>
                ) : (
                  recentNews.map(item => (
                    <tr key={item.id}>
                      <td style={{ maxWidth: '320px' }}>
                        <div className="article-cell-wrapper">
                          <ArticleAvatar 
                            image={item.image} 
                            title={item.title} 
                            categorySlug={item.category_slug} 
                          />
                          <div className="article-cell-text">
                            <span className="article-cell-title" title={item.title}>
                              {item.title}
                            </span>
                            {item.is_featured == 1 && (
                              <span className="pill-badge featured">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`pill-badge category-${item.category_slug || 'default'}`}>
                          {item.category_name}
                        </span>
                      </td>
                      <td className="date-cell">
                        {item.published_at ? item.published_at.substring(0, 10) : 'Recent'}
                      </td>
                      <td>
                        <span className={`status-pill ${item.status === 'published' ? 'active' : 'draft'}`}>
                          <span className="status-dot"></span>
                          {item.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions-row">
                          <Link 
                            to={`/news/${item.slug || item.id}`} 
                            target="_blank" 
                            className="table-action-icon view"
                            title="Preview Article"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link 
                            to="/admin/news" 
                            className="table-action-icon edit"
                            title="Edit Article"
                          >
                            <Edit size={15} />
                          </Link>
                          <button 
                            onClick={() => handleDeleteNews(item.id)}
                            className="table-action-icon delete"
                            title="Delete Article"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Sliders & Active Desks */}
        <div className="overview-card">
          <div className="overview-card-header">
            <h2 className="overview-card-title">RECENT SLIDERS</h2>
            <Link to="/admin/sliders" className="overview-card-link">
              <span>ALL SLIDERS</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="overview-table">
              <thead>
                <tr>
                  <th>BANNER</th>
                  <th>ORDER</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {recentSliders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-table-cell">
                      No homepage sliders configured.
                    </td>
                  </tr>
                ) : (
                  recentSliders.map(slider => (
                    <tr key={slider.id}>
                      <td style={{ maxWidth: '220px' }}>
                        <div className="slider-cell-wrapper">
                          <div className="slider-thumb">
                            <img 
                              src={getFullImageUrl(slider.image)} 
                              alt="" 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                          <span className="slider-cell-title" title={slider.title}>
                            {slider.title}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="order-badge">
                          #{slider.display_order}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${slider.status === 'active' ? 'active' : 'draft'}`}>
                          <span className="status-dot"></span>
                          {slider.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link 
                          to="/admin/sliders" 
                          className="table-action-icon edit"
                          title="Manage Slider"
                        >
                          <Edit size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Editorial Desks Status Box */}
          <div className="desks-overview-footer">
            <div className="desks-header">
              <span className="desks-title">
                <Layers size={14} /> ACTIVE EDITORIAL DESKS
              </span>
              <Link to="/admin/categories" className="desks-link">
                Manage
              </Link>
            </div>
            <div className="desks-pills-row">
              {categoriesOverview.map(cat => (
                <div key={cat.id} className="desk-chip">
                  <span className="desk-chip-name">{cat.name}</span>
                  <span className="desk-chip-count">{cat.news_count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
