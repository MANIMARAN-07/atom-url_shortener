const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { processBulkCsv } = require('../services/bulkService');
const {
  createUrl,
  getUrls,
  deleteUrl,
  updateUrl,
  getUrlAnalytics,
  getQrCode,
  createUrlValidation,
} = require('../controllers/urlController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authMiddleware);

router.post('/', createUrlValidation, createUrl);
router.get('/', getUrls);
router.delete('/:id', deleteUrl);
router.patch('/:id', updateUrl);
router.get('/:id/analytics', getUrlAnalytics);
router.get('/:id/qr', getQrCode);

// Bulk CSV upload
router.post('/bulk', upload.single('csv'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'CSV file is required' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await processBulkCsv(req.file.buffer, req.user._id, baseUrl);

    res.json({
      success: true,
      message: `Processed ${result.total} URLs — ${result.created.length} created, ${result.errors.length} failed`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
