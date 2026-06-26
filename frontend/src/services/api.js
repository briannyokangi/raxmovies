import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rax_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('rax_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('rax_token', token);
  } else {
    localStorage.removeItem('rax_token');
  }
};

// Movie endpoints
export const movieAPI = {
  // Search movies
  searchMovies: (query, page = 1) =>
    api.get('/movies', { params: { search: query, page } }),

  // Get featured movies (trending)
  getFeaturedMovies: () => api.get('/movies/featured'),

  // Get popular movies
  getPopularMovies: (page = 1) =>
    api.get('/movies/popular', { params: { page } }),

  // Get movie details
  getMovie: (id) => api.get(`/movies/${id}`),

  // Get movies using query params
  getMovies: (params) => api.get('/movies', { params }),

  // Toggle favorite
  toggleFavorite: (movieId) => api.post(`/movies/${movieId}/favorite`),

  // Toggle watchlist
  toggleWatchlist: (movieId) => api.post(`/movies/${movieId}/watchlist`),
};

// Review endpoints
export const reviewAPI = {
  // Get reviews for a movie
  getReviews: (movieId) => api.get(`/reviews/${movieId}`),

  // Create review
  createReview: (movieId, reviewData) =>
    api.post(`/reviews/${movieId}`, reviewData),

  // Update review
  updateReview: (reviewId, reviewData) =>
    api.put(`/reviews/${reviewId}`, reviewData),

  // Delete review
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Auth endpoints
export const authAPI = {
  // Register
  register: (userData) => api.post('/auth/register', userData),

  // Login
  login: (credentials) => api.post('/auth/login', credentials),

  // Get current user
  getCurrentUser: () => api.get('/auth/profile'),

  // Change password
  changePassword: (data) => api.put('/auth/password/change', data),

  // Forgot password
  forgotPassword: (data) => api.post('/auth/password/forgot', data),

  // Reset password
  resetPassword: (token, data) => api.post(`/auth/password/reset/${token}`, data),

  // Logout
  logout: () => {
    setAuthToken(null);
    return Promise.resolve();
  },
};

export default api;
