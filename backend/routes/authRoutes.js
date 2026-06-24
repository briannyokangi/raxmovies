const express = require('express');
const {
  register,
  login,
  getProfile,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/favorites/add', auth, addToFavorites);
router.post('/favorites/remove', auth, removeFromFavorites);
router.post('/watchlist/add', auth, addToWatchlist);
router.post('/watchlist/remove', auth, removeFromWatchlist);

module.exports = router;
