const jwt = require('jsonwebtoken');
const jwt_secret = 'thisismysecretforjsonwebtoken';
const Users = require('../models/User.model');

const fetchAdmin = async (req, res, next) => {
    const authHeader = req.header('authToken');

    if (!authHeader) {
        res.status(401).json({ msg: 'Not authenticated' });
    }

    try {
        const data = jwt.verify(authHeader, jwt_secret);
        req.user = data; 
        console.log(data)
        const id = data;

        if (!id) {
            res.status(401).json({ msg: 'Invalid token' });
            return;
        }

        const user = await Users.findById(id);

        if (!user) {
            res.status(401).json({ msg: 'User not found' });
            return;
        }

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
