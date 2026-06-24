const Movie = require('../models/Movie');
const Review = require('../models/Review');

exports.getAllMovies = async (req, res, next) => {
  try {
    const { search, genre, sort } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (genre) query.genre = genre;

    let moviesQuery = Movie.find(query);
    if (sort === 'rating') {
      moviesQuery = moviesQuery.sort({ rating: -1 });
    } else if (sort === 'oldest') {
      moviesQuery = moviesQuery.sort({ year: 1 });
    } else {
      moviesQuery = moviesQuery.sort({ createdAt: -1 });
    }

    const movies = await moviesQuery;
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ rating: -1 }).limit(8);
    res.json({ movies });
  } catch (error) {
    next(error);
  }
};

exports.getPopularMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(8);
    res.json({ movies });
  } catch (error) {
    next(error);
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });

    const reviews = await Review.find({ movieId: movie._id }).populate('userId', 'username');
    const similar = await Movie.find({ genre: movie.genre, _id: { $ne: movie._id } }).limit(4);

    res.json({ movie, reviews, similar });
  } catch (error) {
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
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ message: 'Movie removed.' });
  } catch (error) {
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
    next(error);
  }
};
