// frontend/src/admin/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  FolderTree, Plus, Edit, Trash2, CheckCircle, 
  AlertCircle, X, Loader2 
} from 'lucide-react';
import { newsApi } from '../services/api';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'active',
    display_order: 0
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    newsApi.getAllCategoriesAdmin()
      .then(res => {
        if (res.data && res.data.success) {
          setCategories(res.data.categories || []);
        }
      })
      .catch(err => console.error('Fetch categories error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      status: 'active',
      display_order: categories.length + 1
    });
    setModalOpen(true);
    setMessage('');
    setError('');
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      status: cat.status,
      display_order: cat.display_order
    });
    setModalOpen(true);
    setMessage('');
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Category name is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editingCategory) {
        await newsApi.updateCategory(editingCategory.id, formData);
        setMessage('Category updated successfully!');
      } else {
        await newsApi.createCategory(formData);
        setMessage('New category added successfully!');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? Associated news articles may also be affected.`)) return;

    try {
      await newsApi.deleteCategory(id);
      setMessage('Category deleted successfully.');
      fetchCategories();
    } catch (err) {
      setError('An error occurred while deleting the category.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-heading">Category Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Add, edit, and organize news categories (e.g., Politics, Cinema, Sports, World, Tech).
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} /> Add Category
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
                <th>ID</th>
                <th>Category Name</th>
                <th>Slug (URL)</th>
                <th>Display Order</th>
                <th>News Count</th>
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
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id}>
                    <td>#{cat.id}</td>
                    <td style={{ fontWeight: 700, fontSize: '1.05rem' }}>{cat.name}</td>
                    <td><code>{cat.slug}</code></td>
                    <td>{cat.display_order}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0284c7' }}>
                        {cat.news_count || 0} Articles
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${cat.status}`}>
                        {cat.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button 
                          onClick={() => openEditModal(cat)}
                          className="action-btn edit" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-body">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sports, World, Technology"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug (URL identifier - optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. sports, world, tech"
                />
              </div>

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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
