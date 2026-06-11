const Url = require('../models/Url');
const { recordClick } = require('../services/clickService');

// GET /:shortCode — Redirect to original URL and track the click
const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Look up by shortCode or customAlias
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'Short link not found',
      });
    }

    // Check if link is expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      url.isActive = false;
      await url.save();
      return res.status(410).json({
        success: false,
        message: 'This link has expired',
      });
    }

    // Check if link is active
    if (!url.isActive) {
      return res.status(410).json({
        success: false,
        message: 'This link is no longer active',
      });
    }

    // Increment click count and record click details (non-blocking)
    url.clicks += 1;
    await url.save();
    recordClick(url._id, req).catch(() => {}); // fire-and-forget

    res.redirect(302, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleRedirect };
