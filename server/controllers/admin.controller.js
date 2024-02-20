const Users = require('../models/User.model');
const fetchUsers = async (req, res) => {
    try {
        const users = await Users.find().select('-password');
        res.send(users);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { fetchUsers }