// Desc: Middleware to check if the user is an admin. all the admin routes will pass through this middleware

const jwt = require('jsonwebtoken');
const jwt_secret = 'thisismysecretforjsonwebtoken';
const Users = require('../models/User.model');

const fetchAdmin = async (req, res, next) => {
    const authHeader = req.header('authToken');

    // cannot proceed if the user is not authenticated
    if (!authHeader) {
        res.status(401).json({ msg: 'Not authenticated' });
    }

    try {
        const data = jwt.verify(authHeader, jwt_secret);
        req.user = data; 
        const id = data;

        // check if the token is valid
        if (!id) {
            res.status(401).json({ msg: 'Invalid token' });
            return;
        }

        const user = await Users.findById(id);

        // check if the user exists 
        if (!user) {
            res.status(401).json({ msg: 'User not found' });
            return;
        }

        // check if the user is an admin
        if (user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Some error occurred' });
    }
};

module.exports = fetchAdmin;
