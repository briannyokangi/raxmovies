const User = require('../models/User');
const Review = require('../models/Review');
const Movie = require('../models/Movie');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated.', user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.listReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('userId', 'username email').populate('movieId', 'title');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.deleteReviewByAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    await review.deleteOne();
    res.json({ message: 'Review deleted by admin.' });
  } catch (error) {
    next(error);
  }
};

exports.listMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovieByAdmin = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });

    await movie.deleteOne();
    res.json({ message: 'Movie deleted.' });
  } catch (error) {
    next(error);
  }
};
