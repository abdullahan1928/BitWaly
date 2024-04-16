const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  accessCount: { type: Number, default: 0 },
  shardKey: { type: String, required: true },
  meta: {
    title: String,
    image: String,
  },
  isCustom: { type: Boolean, default: false },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  formerUrls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FormerUrl' }] // Array of former URLs
});

urlSchema.index({ shardKey: 1, shortUrl: 1 }, { unique: true });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
