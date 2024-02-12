const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url' },
  accessedAt: { type: Date, default: Date.now },
  ipAddress: String,
  referrer: String,
  userAgent: String,
  device: String,
  browser: String,
  operatingSystem: String,
  vendor: String,
  location: {},
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  utmTerm: String,
  utmContent: String,
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
