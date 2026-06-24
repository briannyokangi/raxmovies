const express = require('express');
const { createReview, deleteReview } = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;
