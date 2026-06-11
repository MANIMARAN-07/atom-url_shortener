const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getOverview } = require('../controllers/analyticsController');

router.get('/overview', authMiddleware, getOverview);

module.exports = router;
