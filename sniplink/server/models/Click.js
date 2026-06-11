const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    default: 'unknown',
  },
  country: {
    type: String,
    default: 'Unknown',
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown',
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  referrer: {
    type: String,
    default: 'Direct',
  },
});

// Compound index for analytics queries
clickSchema.index({ urlId: 1, timestamp: -1 });

module.exports = mongoose.model('Click', clickSchema);
