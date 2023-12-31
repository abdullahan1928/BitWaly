const Users = require('../models/User.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_secret = 'thisismysecretforjsonwebtoken';



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

        const data = {
            id: user.id
        }


        const authToken = jwt.sign(data, jwt_secret);

        res.send({ authToken });

        user.save().catch(err => console.log(err));

    } catch (e) {
        console.log(e);
        res.status(500).send("Some error has occured");
    }
}