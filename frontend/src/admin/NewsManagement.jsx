// frontend/src/admin/NewsManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Edit, Trash2, Eye, 
  CheckCircle, AlertCircle, X, Upload, Search, Loader2 
} from 'lucide-react';
import { newsApi, getFullImageUrl } from '../services/api';

export default function NewsManagement() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    title_ta: '',
    slug: '',
    category_id: '',
    short_description: '',
    short_description_ta: '',
    content: '',
    content_ta: '',
    author: 'Reporter',
    published_at: '',
    status: 'published',
    is_featured: 0,
    image_url: ''
  });
  const [activeFormTab, setActiveFormTab] = useState('en');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchNews = () => {
    setLoading(true);
    const params = {};
    if (selectedCategoryFilter) params.category_id = selectedCategoryFilter;
    if (searchQuery) params.search = searchQuery;

    newsApi.getAllNewsAdmin(params)
      .then(res => {
        if (res.data && res.data.success) {
          setNewsList(res.data.news || []);
        }
      })
      .catch(err => console.error('Fetch news error:', err))
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    newsApi.getAllCategoriesAdmin()
      .then(res => {
        if (res.data && res.data.success) {
          setCategories(res.data.categories || []);
        }
      })
      .catch(err => console.error('Fetch categories error:', err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
  }, [selectedCategoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews();
  };

  const openAddModal = () => {
    setEditingNews(null);
    setActiveFormTab('en');
    const now = new Date().toISOString().slice(0, 16);
    setFormData({
      title: '',
      title_ta: '',
      slug: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      short_description: '',
      short_description_ta: '',
      content: '',
      content_ta: '',
      author: 'Reporter',
      published_at: now,
      status: 'published',
      is_featured: 0,
      image_url: ''
    });
    setSelectedImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
    setMessage('');
    setError('');
  };

  const openEditModal = (item) => {
    setEditingNews(item);
    setActiveFormTab('en');
    setFormData({
      title: item.title || '',
      title_ta: item.title_ta || '',
      slug: item.slug || '',
      category_id: item.category_id,
      short_description: item.short_description || '',
      short_description_ta: item.short_description_ta || '',
      content: item.content || '',
      content_ta: item.content_ta || '',
      author: item.author || 'Reporter',
      published_at: item.published_at ? item.published_at.replace(' ', 'T').slice(0, 16) : '',
      status: item.status,
      is_featured: item.is_featured ? 1 : 0,
      image_url: item.image || ''
    });
    setSelectedImageFile(null);
    setImagePreview(item.image ? getFullImageUrl(item.image) : null);
    setModalOpen(true);
    setMessage('');
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description || !formData.content || !formData.category_id) {
      setError('Please fill in the title, category, short description, and full content.');
      return;
    }

    setSaving(true);
    setError('');

    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('title_ta', formData.title_ta || '');
    postData.append('slug', formData.slug);
    postData.append('category_id', formData.category_id);
    postData.append('short_description', formData.short_description);
    postData.append('short_description_ta', formData.short_description_ta || '');
    postData.append('content', formData.content);
    postData.append('content_ta', formData.content_ta || '');
    postData.append('author', formData.author);
    postData.append('published_at', formData.published_at ? formData.published_at.replace('T', ' ') + ':00' : '');
    postData.append('status', formData.status);
    postData.append('is_featured', formData.is_featured);

    if (selectedImageFile) {
      postData.append('image', selectedImageFile);
    } else if (formData.image_url) {
      postData.append('image_url', formData.image_url);
    }

    try {
      if (editingNews) {
        await newsApi.updateNews(editingNews.id, postData);
        setMessage('News article updated successfully!');
      } else {
        await newsApi.createNews(postData);
        setMessage('New news article published successfully!');
      }
      setModalOpen(false);
      fetchNews();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving the news article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await newsApi.deleteNews(id);
      setMessage('News article deleted.');
      fetchNews();
    } catch (err) {
      setError('Error deleting the news article.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-heading">News Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Easily publish and manage news articles across all categories.
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} /> Add News
        </button>
      </div>

      {message && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '1rem', background: '#dcfce7', color: '#15803d',
          borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600
        }}>
          <CheckCircle size={20} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '1rem', background: '#fee2e2', color: '#b91c1c',
          borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search news by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.6rem 1rem' }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
              <Search size={16} /> Search
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Category:</label>
            <select 
              className="form-select" 
              style={{ width: 'auto', padding: '0.6rem 1rem' }}
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Published</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No news articles found.
                  </td>
                </tr>
              ) : (
                newsList.map(item => (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={getFullImageUrl(item.image)} 
                        alt="" 
                        style={{ width: '56px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: '280px' }}>
                      {item.title}
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 700, 
                        color: item.category_slug === 'politics' ? '#dc2626' : (item.category_slug === 'cinema' ? '#9333ea' : '#0284c7') 
                      }}>
                        {item.category_name}
                      </span>
                    </td>
                    <td>{item.author}</td>
                    <td style={{ fontSize: '0.85rem' }}>{item.published_at ? item.published_at.substring(0, 16) : ''}</td>
                    <td>
                      {item.is_featured == 1 ? (
                        <span style={{ background: '#ffedd5', color: '#ea580c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                          ★ Featured
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <a 
                          href={`/news/${item.slug || item.id}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="action-btn"
                          title="View"
                        >
                          <Eye size={16} />
                        </a>
                        <button 
                          onClick={() => openEditModal(item)}
                          className="action-btn edit" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.title)}
                          className="action-btn delete" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* Add / Edit News Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '850px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingNews ? 'Edit News Article' : 'Publish News Article'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-body">
              {/* Language Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('en')}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFormTab === 'en' ? 'var(--primary-red, #cc0000)' : '#f1f5f9',
                    color: activeFormTab === 'en' ? '#ffffff' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  English Content (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('ta')}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFormTab === 'ta' ? 'var(--primary-red, #cc0000)' : '#f1f5f9',
                    color: activeFormTab === 'ta' ? '#ffffff' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Tamil Translation (தமிழ்)
                </button>
              </div>

              {activeFormTab === 'en' ? (
                <>
                  {/* Title (EN) */}
                  <div className="form-group">
                    <label className="form-label">News Title (English) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter the main headline in English..."
                      required
                    />
                  </div>

                  {/* Short Description (EN) */}
                  <div className="form-group">
                    <label className="form-label">Short Description (English) *</label>
                    <textarea 
                      className="form-textarea" 
                      rows={3}
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="A brief 2-3 line summary in English..."
                      required
                    />
                  </div>

                  {/* Full Content (EN) */}
                  <div className="form-group">
                    <label className="form-label">Full News Content (English) *</label>
                    <textarea 
                      className="form-textarea" 
                      rows={7}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="<p>Write the full news article in English...</p>"
                      required
                    />
                    <small style={{ color: '#64748b' }}>
                      Note: HTML tags like &lt;p&gt; are supported.
                    </small>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b' }}>
                    💡 <strong>Fallback Notice:</strong> If Tamil translation is not provided, the English version will automatically be displayed as the fallback.
                  </div>

                  {/* Title (TA) */}
                  <div className="form-group">
                    <label className="form-label">செய்தி தலைப்பு (Tamil Title)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.title_ta}
                      onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
                      placeholder="தமிழில் செய்தி தலைப்பை உள்ளிடவும்..."
                    />
                  </div>

                  {/* Short Description (TA) */}
                  <div className="form-group">
                    <label className="form-label">சுருக்கமான விளக்கம் (Tamil Short Description)</label>
                    <textarea 
                      className="form-textarea" 
                      rows={3}
                      value={formData.short_description_ta}
                      onChange={(e) => setFormData({ ...formData, short_description_ta: e.target.value })}
                      placeholder="தமிழில் சுருக்கமான 2-3 வரிகள் விளக்கம்..."
                    />
                  </div>

                  {/* Full Content (TA) */}
                  <div className="form-group">
                    <label className="form-label">முழு செய்தி உள்ளடக்கம் (Tamil Full Content)</label>
                    <textarea 
                      className="form-textarea" 
                      rows={7}
                      value={formData.content_ta}
                      onChange={(e) => setFormData({ ...formData, content_ta: e.target.value })}
                      placeholder="<p>தமிழில் முழு செய்தியையும் இங்கே எழுதவும்...</p>"
                    />
                    <small style={{ color: '#64748b' }}>
                      குறிப்பு: &lt;p&gt; பத்திகள் மற்றும் HTML குறிச்சொற்களைப் பயன்படுத்தலாம்.
                    </small>
                  </div>
                </>
              )}

              {/* Category, Status, Featured in a Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select 
                    className="form-select"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Featured?</label>
                  <select 
                    className="form-select"
                    value={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: parseInt(e.target.value) })}
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes – Mark as Featured</option>
                  </select>
                </div>
              </div>

              {/* Author & Publish Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Author</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Reporter"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Publish Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Featured Image Upload</label>
                <input 
                  type="file" 
                  className="form-input" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-upload-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
