// functions for authentication including signup, signin, get user details, update name, update password, and delete account
const Users = require('../models/User.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_secret = 'thisismysecretforjsonwebtoken';
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const Analytics = require('../models/Analytics.model');

// Controller for user signup
const signupController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        // Check if user already exists
        if (await (Users.findOne({ email: req.body.email }))) {
            return res.status(422).json({ errors: [{ msg: 'User already exists' }] });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = await new Users({
            email: req.body.email,
            password: hashedPassword,
            role: 'user',
        });

        // Generate JWT token
        const authToken = jwt.sign(user.id, jwt_secret);

        res.send({ authToken });

        // Save user
        user.save().catch(err => console.log(err));

    } catch (e) {
        console.log(e);
        res.status(500).send("Some error has occurred");
    }
}

// Controller for user signin
const signinController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find user by email
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(422).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Check password
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(422).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Generate JWT token
        const authToken = jwt.sign(user.id, jwt_secret);
        user.lastLogin = new Date();
        await user.save();

        const role = user.role;

        res.send({ authToken, role });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

// Controller to get user details
const getUserController = async (req, res) => {
    try {
        const userId = req.user;
        const user = await Users.findById(userId).select('-password',);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

// Controller to update user's name
const updateNameController = async (req, res) => {
    try {
        const userId = req.user;
        const user = await Users.findById(userId);
        user.name = req.body.name;
        await user.save();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

// Controller to update user's password
const updatePasswordController = async (req, res) => {
    try {
        const userId = req.user;
        const user = await Users.findById(userId);

        const { oldPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            console.log('invalid old password');
            return res.status(422).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

// Controller to delete user account
const deleteAccountController = async (req, res) => {
    try {
        const userId = req.user;
        let user = await Users.findById(userId);
        if (!user) {
            return res.status(422).json({ errors: [{ msg: 'No user found. Perhaps it was deleted already' }] });
        }

        // Find user's links
        const userLinks = await Url.find({ user: userId });
        const linkIds = userLinks.map(link => link._id);

        // Find user's tags
        const tags = await Tag.find({ user: userId });

        // Find analytics associated with user's links
        const anaId = await Analytics.find({ url: { $in: linkIds } }).select('_id');
        const anaIds = anaId.map(id => id._id);

        // Delete analytics, links, tags, and user
        await Analytics.deleteMany({ _id: { $in: anaIds } });
        await Url.deleteMany({ _id: { $in: linkIds } });
        await Tag.deleteMany({ _id: { $in: tags } });
        await Users.findByIdAndDelete(userId);

        res.send({ msg: 'Account Deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    signupController,
    signinController,
    getUserController,
    updateNameController,
    updatePasswordController,
    deleteAccountController
}
