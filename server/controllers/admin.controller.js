//controller functions for all admin actions
const Users = require('../models/User.model');
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const Analytics = require('../models/Analytics.model');

// Controller to fetch users with statistics
const fetchUsers = async (req, res) => {
  try {
    // Extracting query parameters
    const { page, limit, search, sortField, sortOrder } = req.query;

    let query = {};
    if (search) {
      query = { name: { $regex: new RegExp(search), $options: 'i' } };
    }

    // Counting total users
    const totalCount = await Users.countDocuments(query);

    // Fetching users with pagination and excluding password field
    const users = await Users.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Adding statistics to each user
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

    // Sorting users based on provided field and order
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

// Controller to delete a user and associated data
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

    // Deleting associated analytics, URLs, tags, and user
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

// Controller to get total clicks for a user
const totalClicks = async (req, res) => {
  const { userId } = req.params

  try {
    // Finding all URLs created by the user
    const userUrls = await Url.find({ user: userId });

    // Calculating total clicks and date of first link creation
    const totalClicks = userUrls.reduce((acc, url) => acc + url.accessCount, 0);
    const firstLinkDate = userUrls.length > 0 ? userUrls[0].createdAt : null;

    res.status(200).json({ totalClicks, firstLinkDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controller to get device-wise clicks for a user
const deviceClicks = async (req, res) => {
  try {
    const { userId } = req.params

    // Finding all URLs created by the user
    const userUrls = await Url.find({ user: userId });

    // Extracting analytics for each URL
    const analyticsPromises = userUrls.map(async (url) => {
      return await Analytics.find({ url: url._id });
    });

    const analyticsArray = await Promise.all(analyticsPromises);

    // Flattening the array of analytics
    const allAnalytics = [].concat(...analyticsArray);

    // Counting clicks per device type
    const deviceCounts = allAnalytics.reduce((acc, analytics) => {
      const deviceType = analytics.device || 'Unknown';
      acc[deviceType] = (acc[deviceType] || 0) + 1;
      return acc;
    }, {});

    // Converting device counts to the required format for a pie graph
    const deviceData = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

    res.status(200).json(deviceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controller to get referrer-wise clicks for a user
const referrerClicks = async (req, res) => {
  try {
    const { userId } = req.params

    // Finding all URLs created by the user
    const userUrls = await Url.find({ user: userId });

    // Extracting analytics for each URL
    const analyticsPromises = userUrls.map(async (url) => {
      return await Analytics.find({ url: url._id });
    });

    const analyticsArray = await Promise.all(analyticsPromises);

    // Flattening the array of analytics
    const allAnalytics = [].concat(...analyticsArray);

    // Counting clicks per referrer
    const referrerCounts = allAnalytics.reduce((acc, analytics) => {
      const referrer = analytics.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {});

    // Converting referrer counts to the required format for a pie graph
    const referrerData = Object.entries(referrerCounts).map(([referrer, count]) => ({ referrer, count }));

    res.status(200).json(referrerData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controller to get all locations and their click counts for a user
const allLocations = async (req, res) => {
  try {
    const { userId } = req.params

    // Finding all URLs created by the user
    const userUrls = await Url.find({ user: userId });

    // Extracting analytics for each URL
    const analyticsPromises = userUrls.map(async (url) => {
      return await Analytics.find({ url: url._id });
    });

    const analyticsArray = await Promise.all(analyticsPromises);

    // Flattening the array of analytics
    const allAnalytics = [].concat(...analyticsArray);

    // Counting countries and cities
    const locationCounts = allAnalytics.reduce((acc, analytics) => {
      const { country, city } = analytics.location || { country: 'Unknown', city: 'Unknown' };

      // Counting countries
      acc.countries[country] = (acc.countries[country] || 0) + 1;

      // Counting cities
      acc.cities[city] = (acc.cities[city] || 0) + 1;

      return acc;
    }, { countries: {}, cities: {} });

    // Converting location counts to the required format
    const locationData = {
      countries: Object.entries(locationCounts.countries).map(([country, count]) => ({ country, count })),
      cities: Object.entries(locationCounts.cities).map(([city, count]) => ({ city, count })),
    };

    res.status(200).json(locationData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controller to get top locations by click counts for a user
const topLocations = async (req, res) => {
  try {
    const { userId } = req.params

    const userUrls = await Url.find({ user: userId });

    const analyticsPromises = userUrls.map(async (url) => {
      return await Analytics.find({ url: url._id });
    });

    const analyticsArray = await Promise.all(analyticsPromises);

    const allAnalytics = [].concat(...analyticsArray);

    // Count cities
    const locationCounts = allAnalytics.reduce((acc, analytics) => {
      const { city } = analytics.location || { country: 'Unknown', city: 'Unknown' };

      // Count cities
      acc.cities[city] = (acc.cities[city] || 0) + 1;

      return acc;
    }, { cities: {} });

    // Sort cities by count in descending order
    const sortedCities = Object.entries(locationCounts.cities)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3);

    // Convert sorted cities to the required format
    const locationData = sortedCities
    res.status(200).json(locationData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to get click counts with dates for a user
const clicksWithDates = async (req, res) => {
  const { userId } = req.params

  try {
    const userUrls = await Url.find({ user: userId });

    const clickDataPromises = userUrls.map(async (url) => {
      // Aggregating click data for each URL by date
      const clickData = await Analytics.aggregate([
        { $match: { url: url._id } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$accessedAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id': 1 } },
      ]);

      // Formatting aggregated click data
      const formattedData = clickData.map(data => ({
        date: data._id,
        clicks: data.count,
      }));

      return formattedData;
    });

    // Getting click data for all URLs and merging
    const allClickData = await Promise.all(clickDataPromises);
    const mergedData = mergeClickData(allClickData);

    res.json(mergedData);
  } catch (error) {
    console.error('Error in fetching click data:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Helper function to merge click data for the same dates
const mergeClickData = (dataArrays) => {
  const mergedData = {};

  dataArrays.forEach(dataArray => {
    dataArray.forEach(data => {
      const { date, clicks } = data;
      if (mergedData[date]) {
        mergedData[date] += clicks;
      } else {
        mergedData[date] = clicks;
      }
    });
  });

  return Object.keys(mergedData).map(date => ({ date, clicks: mergedData[date] }));
};

module.exports = { fetchUsers, deleteUser, totalClicks, deviceClicks, referrerClicks, allLocations, topLocations, clicksWithDates }
