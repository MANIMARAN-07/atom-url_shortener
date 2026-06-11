const Url = require('../models/Url');
const Click = require('../models/Click');

// GET /api/analytics/overview — Dashboard overview stats
const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalUrls, activeUrls, createdThisMonth, userUrls] = await Promise.all([
      Url.countDocuments({ userId }),
      Url.countDocuments({ userId, isActive: true }),
      Url.countDocuments({ userId, createdAt: { $gte: startOfMonth } }),
      Url.find({ userId }).select('_id'),
    ]);

    const urlIds = userUrls.map((u) => u._id);

    const totalClicks = await Click.countDocuments({ urlId: { $in: urlIds } });

    // Top 5 performing URLs
    const topUrls = await Url.find({ userId })
      .sort({ clicks: -1 })
      .limit(5)
      .select('originalUrl shortCode customAlias clicks createdAt');

    res.json({
      success: true,
      data: {
        totalUrls,
        totalClicks,
        activeUrls,
        createdThisMonth,
        topUrls,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview };
