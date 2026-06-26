const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset/:token', resetPassword);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/password/change', auth, changePassword);
router.post('/favorites/add', auth, addToFavorites);
router.post('/favorites/remove', auth, removeFromFavorites);
router.post('/watchlist/add', auth, addToWatchlist);
router.post('/watchlist/remove', auth, removeFromWatchlist);

module.exports = router;
