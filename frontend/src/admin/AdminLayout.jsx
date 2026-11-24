// frontend/src/admin/AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Image as ImageIcon, FolderTree, 
  FileText, Sliders, Settings, LogOut, ExternalLink, User, Newspaper 
} from 'lucide-react';
import { newsApi } from '../services/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('reporter_world_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    newsApi.getMe()
      .then(res => {
        if (res.data && res.data.success) {
          setAdmin(res.data.admin);
        } else {
          localStorage.removeItem('reporter_world_admin_token');
          navigate('/admin/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('reporter_world_admin_token');
        navigate('/admin/login');
      })
      .finally(() => setVerifying(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('reporter_world_admin_token');
    localStorage.removeItem('reporter_world_admin_user');
    navigate('/admin/login');
  };

  if (verifying) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        background: '#0b1712', 
        color: '#e5e7eb',
        fontFamily: "'Cinzel', serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '3px solid rgba(212, 175, 55, 0.2)', 
            borderTopColor: '#d4af37', 
            borderRadius: '50%', 
            margin: '0 auto 1.25rem',
            animation: 'spin 1s linear infinite' 
          }} />
          <h2 style={{ fontSize: '1.25rem', letterSpacing: '2px', color: '#d4af37' }}>
            AUTHENTICATING SESSION...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sophisticated Dark Spruce Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand Header */}
        <div className="admin-brand">
          <div className="admin-crest">
            <Newspaper size={20} />
          </div>
          <div>
            <div className="admin-brand-title">
              REPORTER WORLD
            </div>
            <div className="admin-brand-sub">
              ADMIN AREA
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul className="admin-menu">
          <li className="admin-menu-item">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
              <LayoutDashboard size={17} /> 
              <span>DASHBOARD</span>
            </NavLink>
          </li>
          <li className="admin-menu-item">
            <NavLink to="/admin/logo" className={({ isActive }) => isActive ? 'active' : ''}>
              <ImageIcon size={17} /> 
              <span>LOGO MANAGEMENT</span>
            </NavLink>
          </li>
          <li className="admin-menu-item">
            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>
              <FolderTree size={17} /> 
              <span>CATEGORIES</span>
            </NavLink>
          </li>
          <li className="admin-menu-item">
            <NavLink to="/admin/news" className={({ isActive }) => isActive ? 'active' : ''}>
              <FileText size={17} /> 
              <span>NEWS MANAGEMENT</span>
            </NavLink>
          </li>
          <li className="admin-menu-item">
            <NavLink to="/admin/sliders" className={({ isActive }) => isActive ? 'active' : ''}>
              <Sliders size={17} /> 
              <span>SLIDER MANAGEMENT</span>
            </NavLink>
          </li>
          <li className="admin-menu-item">
            <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <Settings size={17} /> 
              <span>COMPANY SETTINGS</span>
            </NavLink>
          </li>
        </ul>

        {/* Bottom User Profile Section */}
        <div className="admin-sidebar-footer">
          {/* User Profile Pill */}
          <div className="admin-user-pill">
            <div className="admin-user-avatar">
              <User size={16} />
            </div>
            <div className="admin-user-info">
              <span className="admin-user-label">LOGGED IN AS</span>
              <strong className="admin-user-name">
                {admin?.name ? (admin.name.toLowerCase().includes('admin') ? 'admin' : admin.name) : 'admin'}
              </strong>
            </div>
          </div>

          {/* Action Links */}
          <div className="admin-footer-actions">
            <button onClick={handleLogout} className="admin-logout-btn">
              <LogOut size={16} /> LOGOUT
            </button>
            <Link to="/" target="_blank" rel="noreferrer" className="admin-live-link">
              <span>LIVE SITE</span> <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="admin-main-content">
        <Outlet context={{ admin }} />
      </main>
    </div>
  );
}
