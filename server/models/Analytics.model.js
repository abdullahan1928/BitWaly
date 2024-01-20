const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url' },
  accessedAt: { type: Date, default: Date.now },
  ipAddress: String,
  country: String, // Assuming you have a way to determine the country from the IP address
  deviceType: String, // For example: 'mobile', 'desktop', etc.
  referrer: String,
  userAgent: String,
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
