const Users = require('../models/User.model');
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const Analytics = require('../models/Analytics.model');

const fetchUsers = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, sortField, sortOrder } = req.query;
  
      let query = {};
      if (search) {
        query = { name: { $regex: new RegExp(search), $options: 'i' } };
      }
  
      const totalCount = await Users.countDocuments(query); // Count total number of users
  
      const users = await Users.find(query)
        .select('-password')
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const linkCount = await Url.countDocuments({ user: user._id });
          const accessCountAggregate = await Url.aggregate([
            { $match: { user: user._id } },
            {
              $group: {
                _id: null,
                totalAccessCount: { $sum: '$accessCount' },
              },
            },
          ]);
  
          const totalAccessCount = accessCountAggregate.length > 0 ? accessCountAggregate[0].totalAccessCount : 0;
  
          return {
            ...user.toObject(),
            linkCount,
            totalAccessCount,
          };
        })
      );
  
      // Sort users if specified
      if (sortField && sortOrder) {
        usersWithStats.sort((a, b) => {
          const valueA = a[sortField];
          const valueB = b[sortField];
  
          const comparison = sortOrder === 'asc' ? 1 : -1;
          return valueA.localeCompare(valueB) * comparison;
        });
      }
  
      res.send({
        totalCount,
        users: usersWithStats,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  };

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
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

module.exports = { fetchUsers, deleteUser }