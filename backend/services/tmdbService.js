const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn('Warning: TMDB_API_KEY is not set in environment variables');
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

/**
 * Search for movies by query
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of movies
 */
exports.searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbClient.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return {
      movies: response.data.results || [],
      totalPages: response.data.total_pages || 1,
      totalResults: response.data.total_results || 0,
    };
  } catch (error) {
    console.error('TMDB Search Error:', error.message);
    throw new Error(`Failed to search movies: ${error.message}`);
  }
};

/**
 * Get trending movies
 * @param {string} timeWindow - 'day' or 'week' (default: 'week')
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of trending movies
 */
exports.getTrendingMovies = async (timeWindow = 'week', page = 1) => {
  try {
    const response = await tmdbClient.get(`/trending/movie/${timeWindow}`, {
      params: {
        page,
      },
    });
    return {
      movies: response.data.results || [],
      totalPages: response.data.total_pages || 1,
    };
  } catch (error) {
    console.error('TMDB Trending Error:', error.message);
    throw new Error(`Failed to fetch trending movies: ${error.message}`);
  }
};

/**
 * Get popular movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of popular movies
 */
exports.getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/popular', {
      params: {
        page,
      },
    });
    return {
      movies: response.data.results || [],
      totalPages: response.data.total_pages || 1,
    };
  } catch (error) {
    console.error('TMDB Popular Error:', error.message);
    throw new Error(`Failed to fetch popular movies: ${error.message}`);
  }
};

/**
 * Get top-rated movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of top-rated movies
 */
exports.getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/top_rated', {
      params: {
        page,
      },
    });
    return {
      movies: response.data.results || [],
      totalPages: response.data.total_pages || 1,
    };
  } catch (error) {
    console.error('TMDB Top Rated Error:', error.message);
    throw new Error(`Failed to fetch top-rated movies: ${error.message}`);
  }
};

/**
 * Get movie details by ID
 * @param {number} movieId - TMDB Movie ID
 * @returns {Promise<Object>} Movie details
 */
exports.getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos',
      },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB Movie Details Error:', error.message);
    throw new Error(`Failed to fetch movie details: ${error.message}`);
  }
};

/**
 * Get movies by genre
 * @param {number} genreId - TMDB Genre ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of movies
 */
exports.getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbClient.get('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page,
      },
    });
    return {
      movies: response.data.results || [],
      totalPages: response.data.total_pages || 1,
    };
  } catch (error) {
    console.error('TMDB Genre Search Error:', error.message);
    throw new Error(`Failed to fetch movies by genre: ${error.message}`);
  }
};

/**
 * Get similar movies
 * @param {number} movieId - TMDB Movie ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of similar movies
 */
exports.getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}/similar`, {
      params: {
        page,
      },
    });
    return {
      movies: response.data.results || [],
      totalPages: response.data.total_pages || 1,
    };
  } catch (error) {
    console.error('TMDB Similar Movies Error:', error.message);
    throw new Error(`Failed to fetch similar movies: ${error.message}`);
  }
};

/**
 * Get image URL for a poster
 * @param {string} posterPath - Poster path from TMDB
 * @param {string} size - Image size ('w342', 'w500', 'w780', 'original')
 * @returns {string} Full poster URL
 */
exports.getImageUrl = (posterPath, size = 'w500') => {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

module.exports = exports;
