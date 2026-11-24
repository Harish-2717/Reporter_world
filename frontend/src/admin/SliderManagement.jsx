// frontend/src/admin/SliderManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sliders, Plus, Edit, Trash2, CheckCircle, 
  AlertCircle, X, Upload, Loader2, ArrowUp, ArrowDown 
} from 'lucide-react';
import { newsApi, getFullImageUrl } from '../services/api';

export default function SliderManagement() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    title_ta: '',
    description: '',
    description_ta: '',
    button_text: 'Read Full Story',
    button_text_ta: '',
    link: '',
    display_order: 1,
    status: 'active',
    image_url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchSliders = () => {
    setLoading(true);
    newsApi.getAllSlidersAdmin()
      .then(res => {
        if (res.data && res.data.success) {
          setSliders(res.data.sliders || []);
        }
      })
      .catch(err => console.error('Fetch sliders error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const openAddModal = () => {
    setEditingSlider(null);
    setFormData({
      title: '',
      title_ta: '',
      description: '',
      description_ta: '',
      button_text: 'Read Full Story',
      button_text_ta: 'முழு செய்தியையும் படிக்க',
      link: '',
      display_order: sliders.length + 1,
      status: 'active',
      image_url: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setModalOpen(true);
    setMessage('');
    setError('');
  };

  const openEditModal = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title || '',
      title_ta: slider.title_ta || '',
      description: slider.description || '',
      description_ta: slider.description_ta || '',
      button_text: slider.button_text || 'Read Full Story',
      button_text_ta: slider.button_text_ta || '',
      link: slider.link || '',
      display_order: slider.display_order,
      status: slider.status,
      image_url: slider.image || ''
    });
    setSelectedFile(null);
    setPreviewUrl(slider.image ? getFullImageUrl(slider.image) : null);
    setModalOpen(true);
    setMessage('');
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Slider title is required.');
      return;
    }

    setSaving(true);
    setError('');

    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('title_ta', formData.title_ta || '');
    postData.append('description', formData.description || '');
    postData.append('description_ta', formData.description_ta || '');
    postData.append('button_text', formData.button_text || '');
    postData.append('button_text_ta', formData.button_text_ta || '');
    postData.append('link', formData.link);
    postData.append('display_order', formData.display_order);
    postData.append('status', formData.status);

    if (selectedFile) {
      postData.append('image', selectedFile);
    } else if (formData.image_url) {
      postData.append('image_url', formData.image_url);
    }

    try {
      if (editingSlider) {
        await newsApi.updateSlider(editingSlider.id, postData);
        setMessage('Slider updated successfully!');
      } else {
        await newsApi.createSlider(postData);
        setMessage('New slider added successfully!');
      }
      setModalOpen(false);
      fetchSliders();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving slider.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await newsApi.deleteSlider(id);
      setMessage('Slider deleted successfully.');
      fetchSliders();
    } catch (err) {
      setError('Error occurred while deleting slider.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-heading">Slider Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage the homepage Hero carousel and featured breaking news slides.
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} /> Add Slider
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

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Button Text</th>
                <th>Link</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : sliders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No sliders found.
                  </td>
                </tr>
              ) : (
                sliders.map(slider => (
                  <tr key={slider.id}>
                    <td>
                      <img 
                        src={getFullImageUrl(slider.image)} 
                        alt="" 
                        style={{ width: '80px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    </td>
                    <td style={{ fontWeight: 700, maxWidth: '280px' }}>
                      {slider.title}
                      {slider.description && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>
                          {slider.description.substring(0, 60)}...
                        </div>
                      )}
                    </td>
                    <td>{slider.button_text}</td>
                    <td><code>{slider.link || '-'}</code></td>
                    <td>
                      <span style={{ fontWeight: 700 }}>#{slider.display_order}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${slider.status}`}>
                        {slider.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button 
                          onClick={() => openEditModal(slider)}
                          className="action-btn edit" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(slider.id, slider.title)}
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

      {/* Add / Edit Slider Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingSlider ? 'Edit Slider' : 'Add Slider'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Slider Title (English) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Featured headline in English..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">சுலைடர் தலைப்பு (Tamil Title)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.title_ta}
                    onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
                    placeholder="தமிழில் செய்தி தலைப்பு..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Short Description (English)</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Summary text in English..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">விளக்கம் (Tamil Description)</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3}
                    value={formData.description_ta}
                    onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
                    placeholder="தமிழில் சுருக்கமான விளக்கம்..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Slider Background Image</label>
                <input 
                  type="file" 
                  className="form-input" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <div className="image-upload-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Button Text (English)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">பொத்தான் உரை (Tamil Button Text)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.button_text_ta}
                    onChange={(e) => setFormData({ ...formData, button_text_ta: e.target.value })}
                    placeholder="எ.கா. முழு செய்தியை படிக்க"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Link URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="e.g. /news/state-budget-session-key-allocations or /politics"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active (Display on Homepage)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
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
                  {saving ? 'Saving...' : 'Save Slider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
