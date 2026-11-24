// frontend/src/services/api.js
import axios from 'axios';

// Dynamically determine base path for dev server, root domain, or subfolder deployment
export const getBasePrefix = () => {
  if (import.meta.env.DEV) {
    return '';
  }
  
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  
  // List of known React top-level routes
  const appRoutes = ['cinema', 'politics', 'world', 'business', 'technology', 'sports', 'entertainment', 'lifestyle', 'news', 'admin', 'login', 'category'];
  
  // If the first path segment is not a known app route, it's a hosting subfolder (e.g. /Reporter World, /demo, etc.)
  if (pathParts.length > 0) {
    const firstSegment = pathParts[0];
    const decodedFirst = decodeURIComponent(firstSegment).toLowerCase();
    if (!appRoutes.includes(decodedFirst) && !appRoutes.includes(firstSegment.toLowerCase())) {
      return '/' + firstSegment;
    }
  }
  
  return '';
};

export const API_BASE_URL = `${getBasePrefix()}/api`;
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads/`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor to inject bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('reporter_world_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper for image URLs
export const getFullImageUrl = (imageName, fallback = '/placeholder-news.svg') => {
  if (!imageName) return fallback;
  if (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('data:')) {
    return imageName;
  }
  return `${UPLOADS_BASE_URL}${imageName}`;
};

// Public & Admin API endpoints
export const newsApi = {
  // Public
  getSliders: () => apiClient.get('/sliders/index.php'),
  getCategories: () => apiClient.get('/categories/index.php'),
  getNews: (params = {}) => apiClient.get('/news/index.php', { params }),
  getNewsDetail: (idOrSlug) => {
    const isId = !isNaN(idOrSlug);
    const param = isId ? { id: idOrSlug } : { slug: idOrSlug };
    return apiClient.get('/news/index.php', { params: param });
  },
  getSettings: () => apiClient.get('/settings/index.php'),
  getLogo: () => apiClient.get('/logo/index.php'),

  // Admin Auth
  login: (credentials) => apiClient.post('/auth/login.php', credentials),
  getMe: () => apiClient.get('/auth/me.php'),

  // Admin Dashboard
  getDashboardStats: () => apiClient.get('/dashboard/index.php'),

  // Admin Categories CRUD
  getAllCategoriesAdmin: () => apiClient.get('/categories/index.php?admin=1'),
  createCategory: (data) => apiClient.post('/categories/index.php', data),
  updateCategory: (id, data) => apiClient.put('/categories/index.php', { ...data, id }),
  deleteCategory: (id) => apiClient.delete(`/categories/index.php?id=${id}`),

  // Admin News CRUD
  getAllNewsAdmin: (params = {}) => apiClient.get('/news/index.php', { params: { ...params, admin: 1 } }),
  createNews: (formData) => apiClient.post('/news/index.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateNews: (id, formData) => {
    // If formData is FormData instance, add _method=PUT and use POST
    if (formData instanceof FormData) {
      formData.append('_method', 'PUT');
      formData.append('id', id);
      return apiClient.post('/news/index.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return apiClient.put('/news/index.php', { ...formData, id });
  },
  deleteNews: (id) => apiClient.delete(`/news/index.php?id=${id}`),

  // Admin Sliders CRUD
  getAllSlidersAdmin: () => apiClient.get('/sliders/index.php?admin=1'),
  createSlider: (formData) => apiClient.post('/sliders/index.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateSlider: (id, formData) => {
    if (formData instanceof FormData) {
      formData.append('_method', 'PUT');
      formData.append('id', id);
      return apiClient.post('/sliders/index.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return apiClient.put('/sliders/index.php', { ...formData, id });
  },
  deleteSlider: (id) => apiClient.delete(`/sliders/index.php?id=${id}`),

  // Admin Settings & Logo
  updateSettings: (formData) => {
    if (formData instanceof FormData) {
      formData.append('_method', 'POST');
      return apiClient.post('/settings/index.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return apiClient.post('/settings/index.php', formData);
  },
  uploadLogo: (formData) => apiClient.post('/logo/index.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleLogoStatus: (isActive) => apiClient.post('/logo/index.php', {
    action: 'toggle_status',
    is_logo_active: isActive ? 1 : 0
  })
};

export default apiClient;
