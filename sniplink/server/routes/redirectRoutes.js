const express = require('express');
const router = express.Router();
const { handleRedirect } = require('../controllers/redirectController');

router.get('/:shortCode', handleRedirect);

module.exports = router;
