const Users = require('../models/User.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_secret = 'thisismysecretforjsonwebtoken';
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const Analytics = require('../models/Analytics.model');

const signupController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        if (await (Users.findOne({ email: req.body.email }))) {
            return res.status(422).json({ errors: [{ msg: 'User already exists' }] });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await new Users({
            email: req.body.email,
            password: hashedPassword,
        });

        const authToken = jwt.sign(user.id, jwt_secret);

        res.send({ authToken });

        user.save().catch(err => console.log(err));

    } catch (e) {
        console.log(e);
        res.status(500).send("Some error has occured");
    }
}

const signinController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await Users.findOne({ email });
        if (!user) {
            return res.status(422).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(422).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const authToken = jwt.sign(user.id, jwt_secret);
        user.lastLogin = new Date();
        await user.save();

        res.send({ authToken });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");

    }
}

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


const deleteAccountController = async (req, res) => {
    try {
        const userId = req.user;
        let user = await Users.findById(userId);
        if (!user) {
            return res.status(422).json({ errors: [{ msg: 'No user found. Perhaps it was deleted already' }] });
        }

        const userLinks = await Url.find({ user: userId });

        const linkIds = userLinks.map(link => link._id);

        const tags = await Tag.find({ user: userId });

        const anaId = await Analytics.find({ url: { $in: linkIds } }).select('_id');
        const anaIds = anaId.map(id => id._id);

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