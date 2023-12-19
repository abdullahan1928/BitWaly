const mongoose = require('mongoose');

const accessDetailSchema = new mongoose.Schema({
  accessedAt: { type: Date, default: Date.now },
  ipAddress: String,
  referrer: String,
  userAgent: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  accessCount: { type: Number, default: 0 },
  accessDetails: [accessDetailSchema],
  shardKey: { type: String, required: true },
});

urlSchema.index({ shardKey: 1, shortUrl: 1 }, { unique: true });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;