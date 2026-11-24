// frontend/src/admin/CompanySettings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, CheckCircle, AlertCircle, Upload, 
  Save, Loader2, Globe, Phone, Mail, MapPin 
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from '../components/SocialIcons';
import { newsApi, getFullImageUrl } from '../services/api';

export default function CompanySettings() {
  const [formData, setFormData] = useState({
    company_name: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
    footer_text: '',
    copyright_text: '',
    logo: '',
    is_logo_active: 1
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchSettings = () => {
    setLoading(true);
    newsApi.getSettings()
      .then(res => {
        if (res.data && res.data.success) {
          const s = res.data.settings || {};
          setFormData({
            company_name: s.company_name || 'Reporter World',
            tagline: s.tagline || 'Voice of the World | Real-time Global News',
            phone: s.phone || '',
            email: s.email || '',
            address: s.address || '',
            facebook: s.facebook || '',
            instagram: s.instagram || '',
            youtube: s.youtube || '',
            twitter: s.twitter || '',
            footer_text: s.footer_text || '',
            copyright_text: s.copyright_text || '',
            logo: s.logo || '',
            is_logo_active: s.is_logo_active !== undefined ? s.is_logo_active : 1
          });
          if (s.logo) {
            setLogoPreview(getFullImageUrl(s.logo));
          }
        }
      })
      .catch(err => console.error('Fetch settings error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const postData = new FormData();
    postData.append('company_name', formData.company_name);
    postData.append('tagline', formData.tagline);
    postData.append('phone', formData.phone);
    postData.append('email', formData.email);
    postData.append('address', formData.address);
    postData.append('facebook', formData.facebook);
    postData.append('instagram', formData.instagram);
    postData.append('youtube', formData.youtube);
    postData.append('twitter', formData.twitter);
    postData.append('footer_text', formData.footer_text);
    postData.append('copyright_text', formData.copyright_text);
    postData.append('is_logo_active', formData.is_logo_active);

    if (logoFile) {
      postData.append('logo', logoFile);
    } else if (formData.logo) {
      postData.append('logo_url', formData.logo);
    }

    try {
      const res = await newsApi.updateSettings(postData);
      if (res.data && res.data.success) {
        setMessage('Company settings saved successfully! Changes are live across all pages.');
        fetchSettings();
      } else {
        setError(res.data.message || 'An error occurred while saving.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--primary-red)' }} />
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="admin-page-heading">Company Settings</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Manage website branding, contact numbers, address, social media links, and footer information.
        </p>
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

      <form onSubmit={handleSubmit}>
        {/* Brand & Logo Section */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="var(--primary-red)" /> Branding & Logo
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Website Name *</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline / Slogan *</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Official Website Logo</label>
            <input 
              type="file" 
              className="form-input" 
              accept="image/*"
              onChange={handleLogoChange}
            />
            {logoPreview && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1',
                display: 'inline-block' 
              }}>
                <img 
                  src={logoPreview} 
                  alt="Logo Preview" 
                  style={{ maxHeight: '60px', maxWidth: '280px', objectFit: 'contain' }} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={20} color="var(--primary-red)" /> Contact Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@reporterworld.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Office Address</label>
            <textarea 
              className="form-textarea" 
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full office address..."
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>
            Social Media Links
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FacebookIcon size={16} /> Facebook Page URL
              </label>
              <input 
                type="url" 
                className="form-input" 
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/reporterworld"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <InstagramIcon size={16} /> Instagram Profile URL
              </label>
              <input 
                type="url" 
                className="form-input" 
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/reporterworld"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <YoutubeIcon size={16} /> YouTube Channel URL
              </label>
              <input 
                type="url" 
                className="form-input" 
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/@reporterworld"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TwitterIcon size={16} /> Twitter / X Profile URL
              </label>
              <input 
                type="url" 
                className="form-input" 
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://twitter.com/reporterworld"
              />
            </div>
          </div>
        </div>

        {/* Footer & Legal */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: '1.5rem' }}>
            Footer & Copyright Content
          </h2>

          <div className="form-group">
            <label className="form-label">Footer Description Text</label>
            <textarea 
              className="form-textarea" 
              rows={3}
              value={formData.footer_text}
              onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Copyright Text</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.copyright_text}
              onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
            />
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '3rem' }}>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={20} /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
