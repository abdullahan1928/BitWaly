const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    role: { type: String, default: "user"} // either user or admin
});

User = mongoose.model("Users", userSchema);

module.exports = User; 