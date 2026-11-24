// frontend/src/admin/LogoManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, CheckCircle, 
  AlertCircle, Eye, EyeOff, Loader2 
} from 'lucide-react';
import { newsApi, getFullImageUrl } from '../services/api';

export default function LogoManagement() {
  const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchLogo = () => {
    setLoading(true);
    newsApi.getLogo()
      .then(res => {
        if (res.data && res.data.success) {
          setLogoData(res.data);
        }
      })
      .catch(err => console.error('Error fetching logo:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage('');
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      const res = await newsApi.uploadLogo(formData);
      if (res.data && res.data.success) {
        setMessage('Logo uploaded successfully! The new logo is now active across the website.');
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchLogo();
      } else {
        setError(res.data.message || 'An error occurred during upload.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!logoData) return;
    const newStatus = !logoData.is_logo_active;

    try {
      const res = await newsApi.toggleLogoStatus(newStatus);
      if (res.data && res.data.success) {
        setLogoData(prev => ({ ...prev, is_logo_active: newStatus }));
        setMessage(`Logo status updated: ${newStatus ? 'Active' : 'Disabled'}`);
      }
    } catch (err) {
      setError('Failed to update logo status.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary-red)' }} />
        <p>Loading logo information...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-heading" style={{ marginBottom: '1.5rem' }}>
        Logo Management
      </h1>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Current Active Logo Box */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Current Active Logo</h2>
            <button 
              onClick={handleToggleStatus}
              className="btn-secondary"
              style={{ 
                padding: '0.4rem 0.8rem', 
                fontSize: '0.85rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                backgroundColor: logoData?.is_logo_active ? '#fee2e2' : '#dcfce7',
                color: logoData?.is_logo_active ? '#b91c1c' : '#15803d'
              }}
            >
              {logoData?.is_logo_active ? (
                <>
                  <EyeOff size={15} /> Disable Logo
                </>
              ) : (
                <>
                  <Eye size={15} /> Enable Logo
                </>
              )}
            </button>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            This logo appears directly in the main website header and footer.
          </p>

          <div style={{ 
            backgroundColor: '#f8fafc', 
            border: '2px dashed #cbd5e1', 
            borderRadius: '12px', 
            padding: '2rem', 
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            {logoData?.logo_url ? (
              <img 
                src={logoData.logo_url} 
                alt="Current Logo" 
                style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ color: '#94a3b8' }}>No logo currently set.</div>
            )}
          </div>

          {/* Dark Background Preview */}
          <div style={{ 
            backgroundColor: '#0f172a', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            textAlign: 'center' 
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Dark Background Preview:</p>
            {logoData?.logo_url && (
              <img 
                src={logoData.logo_url} 
                alt="Dark Preview" 
                style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }} 
              />
            )}
          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
            Status: <strong>{logoData?.is_logo_active ? 'Active' : 'Disabled'}</strong>
          </div>
        </div>

        {/* Upload / Replace Logo Box */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: '0.5rem' }}>
            Upload / Replace Logo
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Supported formats: <strong>PNG, JPG, JPEG, WEBP, SVG</strong> (Max 10MB).
          </p>

          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label className="form-label">Select Logo File</label>
              <input 
                type="file" 
                className="form-input" 
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                onChange={handleFileChange}
              />
            </div>

            {previewUrl && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                  New Logo Preview:
                </p>
                <div style={{ 
                  backgroundColor: '#f1f5f9', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  textAlign: 'center' 
                }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} 
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={uploading || !selectedFile}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} /> Replace Logo
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
