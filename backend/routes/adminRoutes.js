const express = require('express');
const { listUsers, updateUserRole, listReviews, deleteReviewByAdmin } = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(auth, adminOnly);
router.get('/users', listUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/reviews', listReviews);
router.delete('/reviews/:id', deleteReviewByAdmin);

module.exports = router;
