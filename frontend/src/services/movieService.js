import { movieAPI } from './api';

const normalizeMovie = (movie) => ({
  id: movie.id || movie._id || movie.tmdbId || movie.uuid || '',
  _id: movie._id || movie.id || movie.tmdbId || '',
  title: movie.title || movie.name || 'Untitled movie',
  poster: movie.posterUrl || movie.poster || movie.poster_path || movie.poster_url || movie.image_url || '',
  backdrop: movie.backdropUrl || movie.backdrop || movie.backdrop_path || movie.backdrop_url || '',
  releaseYear:
    movie.releaseYear ||
    movie.release_year ||
    (movie.release_date ? new Date(movie.release_date).getFullYear() : '') ||
    movie.year ||
    '',
  genre: Array.isArray(movie.genre)
    ? movie.genre.join(', ')
    : movie.genre || movie.genres || movie.category || 'General',
  rating: movie.rating || movie.vote_average || movie.score || 0,
  description: movie.description || movie.overview || movie.summary || 'A cinematic experience awaits.',
  trailerUrl: movie.trailerUrl || movie.trailer_url || movie.trailer || movie.video_url || '',
  featured: Boolean(movie.featured),
});

const fetchAndNormalize = async (request) => {
  try {
    const response = await request();
    const payload = response?.data || response || {};
    const movies = Array.isArray(payload.movies) ? payload.movies : [];

    return {
      movies: movies.map(normalizeMovie),
      totalPages: payload.totalPages || 1,
    };
  } catch (error) {
    console.error('Movie service error:', error);
    return { movies: [], totalPages: 1 };
  }
};

export const movieService = {
  getFeaturedMovies: async () => {
    const result = await fetchAndNormalize(() => movieAPI.getFeaturedMovies());
    return result.movies;
  },

  getPopularMovies: async (page = 1) => {
    return fetchAndNormalize(() => movieAPI.getPopularMovies(page));
  },

  searchMovies: async (query, page = 1) => {
    return fetchAndNormalize(() => movieAPI.searchMovies(query, page));
  },

  getMovies: async (params = {}) => {
    return fetchAndNormalize(() => movieAPI.getMovies(params));
  },
};

export default movieService;
