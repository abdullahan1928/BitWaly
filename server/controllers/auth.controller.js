const Users = require('../models/User.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_secret = 'thisismysecretforjsonwebtoken';
const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');

exports.signupController = async (req, res) => {
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

exports.signinController = async (req, res) => {
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

exports.getUserController = async (req, res) => {
    try {
        const userId = req.user;
        const user = await Users.findById(userId).select('-password',);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


exports.updateUserController = async (req, res) => {
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


exports.updatePasswordController = async (req, res) => {
    try {
        const userId = req.user;
        const user = await Users.findById(userId);

        if (!await bcrypt.compare(req.body.oldPassword, user.password)) {
            return res.status(422).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedPassword;
        await user.save();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}


exports.deleteAccountController = async (req, res) => {
    try {
        const userId = req.user;
        console.log(userId)
        let user = await Users.findById(userId);
        if (!user) {
            return res.status(422).json({ errors: [{ msg: 'No user found. Perhaps it was deleted already' }] });
        }
        

        const userLinks = await Url.find({ user: userId });


        const linkIds = userLinks.map(link => link._id);


        const anaId = await Analytics.find({ url: { $in: linkIds } }).select('_id');
        const anaIds = anaId.map(id => id._id);

        await Analytics.deleteMany({ _id: { $in: anaIds } });
        await Url.deleteMany({ _id: { $in: linkIds } });
        await Users.findByIdAndDelete(userId);
        
        res.send({ msg: 'Account Deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}