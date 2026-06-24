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

