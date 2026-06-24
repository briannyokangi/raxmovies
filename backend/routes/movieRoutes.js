const express = require('express');
const {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  toggleFavorite,
  toggleWatchlist,
  getFeaturedMovies,
  getPopularMovies,
} = require('../controllers/movieController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/featured', getFeaturedMovies);
router.get('/popular', getPopularMovies);
router.get('/', getAllMovies);
router.get('/:id', getMovie);
router.post('/', auth, adminOnly, createMovie);
router.put('/:id', auth, adminOnly, updateMovie);
router.delete('/:id', auth, adminOnly, deleteMovie);
router.post('/:id/favorite', auth, toggleFavorite);
router.post('/:id/watchlist', auth, toggleWatchlist);

module.exports = router;
