const Review = require('../models/Review');

exports.createReview = async (req, res, next) => {
  try {
    const { movieId, comment, rating } = req.body;
    if (!movieId || !comment || rating === undefined) {
      return res.status(400).json({ message: 'All review fields are required.' });
    }

    const review = await Review.create({ userId: req.user._id, movieId, comment, rating });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    if (!review.userId.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await review.remove();
    res.json({ message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};
