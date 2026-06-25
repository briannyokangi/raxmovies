const Movie = require('../models/Movie');
const Review = require('../models/Review');
const tmdbService = require('../services/tmdbService');
const mongoose = require('mongoose');
/**
 * Search for movies from TMDB API
 * Includes both TMDB data and local MongoDB reviews/ratings
 */
exports.getAllMovies = async (req, res, next) => {
  try {
    const { search, page = 1, genre } = req.query;

    // If search query provided, use TMDB search
    if (search) {
      const result = await tmdbService.searchMovies(search, page);
      
      // Enrich TMDB data with local reviews
      const enrichedMovies = result.movies.map(movie => ({
        id: movie.id,
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        posterUrl: tmdbService.getImageUrl(movie.poster_path),
      }));

      return res.json({
        movies: enrichedMovies,
        totalPages: result.totalPages,
        totalResults: result.totalResults,
        page: parseInt(page),
      });
    }

    // If genre provided, use TMDB genre discovery
    if (genre) {
      const genreId = parseInt(genre);
      const result = await tmdbService.getMoviesByGenre(genreId, page);

      const enrichedMovies = result.movies.map(movie => ({
        id: movie.id,
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        posterUrl: tmdbService.getImageUrl(movie.poster_path),
      }));

      return res.json({
        movies: enrichedMovies,
        totalPages: result.totalPages,
        page: parseInt(page),
      });
    }

    // Default: return local MongoDB movies for admin-added content
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(20);
    res.json({ movies });
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};

/**
 * Get featured movies from TMDB trending
 */
exports.getFeaturedMovies = async (req, res, next) => {
  try {
    const result = await tmdbService.getTrendingMovies('week', 1);
    
    const enrichedMovies = result.movies.slice(0, 8).map(movie => ({
      id: movie.id,
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      popularity: movie.popularity,
      posterUrl: tmdbService.getImageUrl(movie.poster_path, 'w500'),
      backdropUrl: tmdbService.getImageUrl(movie.backdrop_path, 'w1280'),
    }));

    res.json({ movies: enrichedMovies });
  } catch (error) {
  console.error("getMovie error:", error);
  next(error);
}
};

/**
 * Get popular movies from TMDB
 */
exports.getPopularMovies = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const result = await tmdbService.getPopularMovies(page);
    
    const enrichedMovies = result.movies.map(movie => ({
      id: movie.id,
      tmdbId: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      popularity: movie.popularity,
      posterUrl: tmdbService.getImageUrl(movie.poster_path),
    }));

    res.json({
      movies: enrichedMovies,
      totalPages: result.totalPages,
      page: parseInt(page),
    });
  } catch (error) {
  console.error("getMovie error:", error);
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

    // If not in local DB, try TMDB (id should be numeric for TMDB)
    if (isNaN(id)) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    const tmdbMovie = await tmdbService.getMovieDetails(parseInt(id));
    
    // Get similar movies from TMDB
    const similarResult = await tmdbService.getSimilarMovies(parseInt(id));
    const similarMovies = similarResult.movies.slice(0, 4).map(m => ({
      id: m.id,
      tmdbId: m.id,
      title: m.title,
      poster_path: m.poster_path,
      posterUrl: tmdbService.getImageUrl(m.poster_path),
    }));

    const enrichedMovie = {
      id: tmdbMovie.id,
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      poster_path: tmdbMovie.poster_path,
      backdrop_path: tmdbMovie.backdrop_path,
      release_date: tmdbMovie.release_date,
      vote_average: tmdbMovie.vote_average,
      popularity: tmdbMovie.popularity,
      runtime: tmdbMovie.runtime,
      genres: tmdbMovie.genres,
      budget: tmdbMovie.budget,
      revenue: tmdbMovie.revenue,
      status: tmdbMovie.status,
      posterUrl: tmdbService.getImageUrl(tmdbMovie.poster_path),
      backdropUrl: tmdbService.getImageUrl(tmdbMovie.backdrop_path, 'w1280'),
      credits: tmdbMovie.credits,
      videos: tmdbMovie.videos,
    };

    res.json({
      movie: enrichedMovie,
      reviews,
      similar: similarMovies,
      source: 'tmdb',
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
