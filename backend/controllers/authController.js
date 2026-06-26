const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await User.create({ username, email, password, role });
    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
        watchlist: user.watchlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
        watchlist: user.watchlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, bio, avatar } = req.body;
    const user = req.user;

    if (username !== undefined && username.trim()) {
      const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
      }
      user.username = username.trim();
    }

    if (email !== undefined && email.trim()) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
        watchlist: user.watchlist,
        createdAt: user.createdAt,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    const user = req.user;
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    res.json({ message: 'Password reset link generated.', resetLink });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }

    user.password = password;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.addToFavorites = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required.' });
    }

    const user = req.user;
    if (user.favorites.some((fav) => fav.toString() === movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites.' });
    }

    user.favorites.push(movieId);
    await user.save();
    res.json({ favorites: user.favorites, user });
  } catch (error) {
    next(error);
  }
};

exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required.' });
    }

    const user = req.user;
    user.favorites = user.favorites.filter((fav) => fav.toString() !== movieId);
    await user.save();
    res.json({ favorites: user.favorites, user });
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required.' });
    }

    const user = req.user;
    if (user.watchlist.some((item) => item.toString() === movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist.' });
    }

    user.watchlist.push(movieId);
    await user.save();
    res.json({ watchlist: user.watchlist, user });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required.' });
    }

    const user = req.user;
    user.watchlist = user.watchlist.filter((item) => item.toString() !== movieId);
    await user.save();
    res.json({ watchlist: user.watchlist, user });
  } catch (error) {
    next(error);
  }
};

