const Movie = require('../models/Movie');
const Review = require('../models/Review');
const tmdbService = require('../services/tmdbService');
const mongoose = require('mongoose');
const { sampleMovies } = require('../data/sampleMovies');

const buildMovieResponse = (movie) => ({
  id: movie._id,
  _id: movie._id,
  title: movie.title,
  description: movie.description || movie.overview || '',
  overview: movie.description || movie.overview || '',
  poster: movie.poster,
  posterUrl: movie.poster,
  trailer: movie.trailer,
  trailerUrl: movie.trailer,
  genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre].filter(Boolean),
  genres: Array.isArray(movie.genre) ? movie.genre : [movie.genre].filter(Boolean),
  year: movie.year,
  releaseYear: movie.year,
  release_date: movie.year ? `${movie.year}-01-01` : null,
  duration: movie.duration,
  runtime: movie.duration,
  rating: movie.rating,
  vote_average: movie.rating,
  cast: movie.cast || [],
  director: movie.director || '',
  featured: movie.featured || false,
  createdAt: movie.createdAt,
  updatedAt: movie.updatedAt,
  source: 'local',
});

const getLocalMovies = async ({ search = '', genre = '', year = '', page = 1, limit = 12, featured = false, sort = 'createdAt' } = {}) => {
  const query = {};

  if (featured) {
    query.featured = true;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { cast: { $in: [searchRegex] } },
      { genre: { $in: [searchRegex] } },
    ];
  }

  if (genre) {
    query.genre = { $regex: new RegExp(String(genre), 'i') };
  }

  if (year) {
    query.year = Number(year);
  }

  if (!global.dbConnected) {
    const filtered = sampleMovies.filter((movie) => {
      if (featured && !movie.featured) return false;
      if (search) {
        const haystack = `${movie.title} ${movie.description} ${movie.genre?.join(' ')} ${movie.cast?.join(' ')}`.toLowerCase();
        if (!haystack.includes(String(search).toLowerCase())) return false;
      }
      if (genre) {
        if (!movie.genre?.some((item) => item.toLowerCase().includes(String(genre).toLowerCase()))) return false;
      }
      if (year && movie.year !== Number(year)) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const paged = sorted.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

    return {
      movies: paged.map((movie) => ({ ...buildMovieResponse(movie), source: 'sample' })),
      totalPages: Math.max(1, Math.ceil(sorted.length / Number(limit))),
      totalResults: sorted.length,
    };
  }

  const total = await Movie.countDocuments(query);
  const movies = await Movie.find(query)
    .sort(sort === 'rating' ? { rating: -1, createdAt: -1 } : { createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    movies: movies.map(buildMovieResponse),
    totalPages: Math.max(1, Math.ceil(total / Number(limit))),
    totalResults: total,
  };
};

/**
 * Search for movies from MongoDB and optionally fall back to TMDB
 */
exports.getAllMovies = async (req, res, next) => {
  try {
    const { search, page = 1, genre, year } = req.query;
    const parsedPage = Math.max(1, parseInt(page) || 1);

    const result = await getLocalMovies({
      search,
      genre,
      year,
      page: parsedPage,
      limit: 12,
    });

    return res.json({
      movies: result.movies,
      totalPages: result.totalPages,
      totalResults: result.totalResults,
      page: parsedPage,
    });
  } catch (error) {
    console.error('getMovie error:', error);
    next(error);
  }
};

/**
 * Get featured movies from TMDB trending
 */
exports.getFeaturedMovies = async (req, res, next) => {
  try {
    const result = await getLocalMovies({ featured: true, page: 1, limit: 8, sort: 'rating' });
    res.json({ movies: result.movies });
  } catch (error) {
    console.error('getMovie error:', error);
    next(error);
  }
};

/**
 * Get popular movies from TMDB
 */
exports.getPopularMovies = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const result = await getLocalMovies({ page, limit: 12, sort: 'rating' });

    res.json({
      movies: result.movies,
      totalPages: result.totalPages,
      page: parseInt(page),
    });
  } catch (error) {
    console.error('getMovie error:', error);
    next(error);
  }
};


/**
 * Get movie details - tries local DB first, then TMDB
 */
exports.getMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First try to find in local MongoDB
    let movie = null;

if (mongoose.Types.ObjectId.isValid(id)) {
  movie = await Movie.findById(id);
}
    let reviews = [];
    let similar = [];

    if (movie) {
      // Local movie found, get reviews and similar movies
      reviews = await Review.find({ movieId: movie._id }).populate('userId', 'username');
      similar = await Movie.find({ genre: movie.genre, _id: { $ne: movie._id } }).limit(4);
      
      return res.json({ movie, reviews, similar, source: 'local' });
    }

    if (!global.dbConnected) {
      const sampleMovie = sampleMovies.find((item) => item.title.toLowerCase() === id.toLowerCase() || item.title.toLowerCase().includes(String(id).toLowerCase()));
      if (sampleMovie) {
        return res.json({
          movie: { ...buildMovieResponse(sampleMovie), source: 'sample' },
          reviews,
          similar: sampleMovies.filter((item) => item.title !== sampleMovie.title).slice(0, 4).map((item) => ({ ...buildMovieResponse(item), source: 'sample' })),
          source: 'sample',
        });
      }
    }

    const localMovies = await Movie.find().sort({ createdAt: -1 }).limit(4);
    const similarMovies = localMovies.filter((item) => item._id.toString() !== movie?._id?.toString()).slice(0, 4).map(buildMovieResponse);

    res.json({
      movie: buildMovieResponse(movie),
      reviews,
      similar: similarMovies,
      source: 'local',
    });
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};

exports.createMovie = async (req, res, next) => {
  try {
    const { title, description, poster, trailer, genre, year, rating, duration, cast } = req.body;
    if (!title || !description || !poster || !trailer || !genre || !year || rating === undefined || !duration) {
      return res.status(400).json({ message: 'Missing required movie fields.' });
    }

    const parsedGenre = Array.isArray(genre)
      ? genre
      : String(genre)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

    const parsedCast = Array.isArray(cast)
      ? cast
      : String(cast || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

    const movie = await Movie.create({
      title,
      description,
      poster,
      trailer,
      genre: parsedGenre,
      year,
      rating,
      duration,
      cast: parsedCast,
    });
    res.status(201).json(movie);
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};

exports.updateMovie = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (updateData.genre) {
      updateData.genre = Array.isArray(updateData.genre)
        ? updateData.genre
        : String(updateData.genre)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    if (updateData.cast) {
      updateData.cast = Array.isArray(updateData.cast)
        ? updateData.cast
        : String(updateData.cast)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json(movie);
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ message: 'Movie removed.' });
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const user = req.user;
    const isFavorite = user.favorites.some((fav) => fav.toString() === movieId);
    if (isFavorite) {
      user.favorites = user.favorites.filter((fav) => fav.toString() !== movieId);
    } else {
      user.favorites.push(movieId);
    }
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};

exports.toggleWatchlist = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const user = req.user;
    const isInWatchlist = user.watchlist.some((item) => item.toString() === movieId);
    if (isInWatchlist) {
      user.watchlist = user.watchlist.filter((item) => item.toString() !== movieId);
    } else {
      user.watchlist.push(movieId);
    }
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};
