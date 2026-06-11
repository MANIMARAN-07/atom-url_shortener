const { validationResult, body } = require('express-validator');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const Click = require('../models/Click');
const QRCode = require('qrcode');

const createUrlValidation = [
  body('originalUrl')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .custom((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Invalid URL format');
      }
    }),
  body('customAlias')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Alias must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Alias can only contain letters, numbers, hyphens, and underscores'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
];

// POST /api/urls — Create a new short URL
const createUrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { originalUrl, customAlias, expiresAt } = req.body;

    // Check alias uniqueness
    if (customAlias) {
      const aliasExists = await Url.findOne({ customAlias });
      if (aliasExists) {
        return res.status(409).json({
          success: false,
          message: `Alias "${customAlias}" is already taken`,
        });
      }
    }

    // Generate unique 6-char short code
    let shortCode = nanoid(6);
    while (await Url.findOne({ shortCode })) {
      shortCode = nanoid(6);
    }

    const url = await Url.create({
      userId: req.user._id,
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      expiresAt: expiresAt || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Short URL created',
      data: { url },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/urls — Get all URLs for logged-in user (paginated)
const getUrls = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [urls, total] = await Promise.all([
      Url.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Url.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      data: {
        urls,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/urls/:id — Delete a URL owned by the user
const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found or not owned by you',
      });
    }

    // Clean up associated clicks
    await Click.deleteMany({ urlId: url._id });

    res.json({
      success: true,
      message: 'URL deleted',
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/urls/:id — Edit URL or alias
const updateUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found or not owned by you',
      });
    }

    const { originalUrl, customAlias, expiresAt, isActive } = req.body;

    if (originalUrl) {
      try {
        new URL(originalUrl);
        url.originalUrl = originalUrl;
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format',
        });
      }
    }

    if (customAlias !== undefined) {
      if (customAlias && customAlias !== url.customAlias) {
        const aliasExists = await Url.findOne({
          customAlias,
          _id: { $ne: url._id },
        });
        if (aliasExists) {
          return res.status(409).json({
            success: false,
            message: `Alias "${customAlias}" is already taken`,
          });
        }
        url.customAlias = customAlias;
      } else if (!customAlias) {
        url.customAlias = undefined;
      }
    }

    if (expiresAt !== undefined) {
      url.expiresAt = expiresAt || null;
    }

    if (typeof isActive === 'boolean') {
      url.isActive = isActive;
    }

    await url.save();

    res.json({
      success: true,
      message: 'URL updated',
      data: { url },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/urls/:id/analytics — Full analytics for a URL
const getUrlAnalytics = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalClicks,
      uniqueClicks,
      clicksByDay,
      clicksByDevice,
      clicksByCountry,
      recentVisits,
    ] = await Promise.all([
      Click.countDocuments({ urlId: url._id }),
      Click.distinct('ip', { urlId: url._id }).then((ips) => ips.length),
      Click.aggregate([
        { $match: { urlId: url._id, timestamp: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Click.aggregate([
        { $match: { urlId: url._id } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
      ]),
      Click.aggregate([
        { $match: { urlId: url._id } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Click.find({ urlId: url._id })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean(),
    ]);

    // Fill in missing days in the 30-day range
    const dayMap = {};
    clicksByDay.forEach((d) => (dayMap[d._id] = d.count));
    const filledDays = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      filledDays.push({ date: key, clicks: dayMap[key] || 0 });
    }

    const lastVisit = await Click.findOne({ urlId: url._id })
      .sort({ timestamp: -1 })
      .select('timestamp');

    res.json({
      success: true,
      data: {
        url,
        analytics: {
          totalClicks,
          uniqueClicks,
          lastVisited: lastVisit?.timestamp || null,
          clicksByDay: filledDays,
          clicksByDevice,
          clicksByCountry,
          recentVisits,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/urls/:id/qr — Generate QR code for a short URL
const getQrCode = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    const shortUrl = `${req.protocol}://${req.get('host')}/${url.customAlias || url.shortCode}`;
    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#0F172A', light: '#FFFFFF' },
    });

    res.json({
      success: true,
      data: { qrCode: qrDataUrl, shortUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUrl,
  getUrls,
  deleteUrl,
  updateUrl,
  getUrlAnalytics,
  getQrCode,
  createUrlValidation,
};
