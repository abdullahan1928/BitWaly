const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    urls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Url' }],
    name: { type: String, required: true },
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
