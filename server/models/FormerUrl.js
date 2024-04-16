const mongoose = require('mongoose');

const formerUrlSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    originalUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: Date.now },
    accessCount: { type: Number, default: 0 },
    shardKey: { type: String, required: true },
    meta: {
        title: String,
        image: String,
    },
    isCustom: { type: Boolean, default: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
});

const FormerUrl = mongoose.model('FormerUrl', formerUrlSchema);

module.exports = FormerUrl;
