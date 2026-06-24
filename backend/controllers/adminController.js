const User = require('../models/User');
const Review = require('../models/Review');

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

    await review.remove();
    res.json({ message: 'Review deleted by admin.' });
  } catch (error) {
    next(error);
  }
};
