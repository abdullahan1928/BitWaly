const jwt = require('jsonwebtoken');
const jwt_secret = 'thisismysecretforjsonwebtoken';

const fetchAdmin = (req, res, next) => {
    const authHeader = req.header('authToken');

    if (!authHeader) {
        res.status(401).json({ msg: 'Not authenticated' });
    }

    try {
        const data = jwt.verify(authHeader, jwt_secret);
        req.user = data;    // this will be available in the request object
        // console.log(req.user)
        const { role } = data;

        if (role === 'admin') {
            // User is an admin
            next();
        } else {
            res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({ msg: 'Some error occurred' });
    }
};

module.exports = fetchAdmin;


module.exports = fetchAdmin;
