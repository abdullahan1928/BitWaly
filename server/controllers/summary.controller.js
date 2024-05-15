//overall summary of user's account
const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');

// Controller to get total clicks for all URLs of a user
const totalClicks = async (req, res) => {
  const userId = req.user;

  try {
    const userUrls = await Url.find({ user: userId });

    // Calculate total clicks and get creation date of the first link
    const totalClicks = userUrls.reduce((acc, url) => acc + url.accessCount, 0);
    const firstLinkDate = userUrls.length > 0 ? userUrls[0].createdAt : null;

    res.status(200).json({ totalClicks, firstLinkDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controller to get device-wise clicks for all URLs of a user
const deviceClicks = async (req, res) => {
  try {
    const userId = req.user;

    // Find all URLs created by the user
    const userUrls = await Url.find({ user: userId });

    // Extract analytics for each URL
    const analyticsPromises = userUrls.map(async (url) => {
      return await Analytics.find({ url: url._id });
    });

    const analyticsArray = await Promise.all(analyticsPromises);

    // Flatten the array of analytics
    const allAnalytics = [].concat(...analyticsArray);

    // Count clicks by device type
    const deviceCounts = allAnalytics.reduce((acc, analytics) => {
      const deviceType = analytics.device || 'Unknown';
      acc[deviceType] = (acc[deviceType] || 0) + 1;
      return acc;
    }, {});

    // Convert device counts to the required format for a pie graph
    const deviceData = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

    res.status(200).json(deviceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controller to get referrer-wise clicks for all URLs of a user
const referrerClicks = async (req, res) => {
  try {
    const userId = req.user;

    // Find all URLs created by the user
    const userUrls = await Url.find({ user: userId });

    // Extract analytics for each URL
    const analyticsPromises = userUrls.map(async (url) => {
      return await Analytics.find({ url: url._id });
    });

    const analyticsArray = await Promise.all(analyticsPromises);

    // Flatten the array of analytics
    const allAnalytics = [].concat(...analyticsArray);

    // Count clicks by referrer
    const referrerCounts = allAnalytics.reduce((acc, analytics) => {
      const referrer = analytics.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {});

    // Convert referrer counts to the required format for a pie graph
    const referrerData = Object.entries(referrerCounts).map(([referrer, count]) => ({ referrer, count }));

    res.status(200).json(referrerData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controller to get all locations (countries and cities) for all URLs of a user
const allLocations = async (req, res) => {
  try {
    const userId = req.user;

    // Find all URLs created by the user
    const userUrls = await Url.find({ user: userId });

    // Extract analytics for each URL
    const analyticsPromises = userUrls.map(async (url) => {
      return await Analytics.find({ url: url._id });
    });

    const analyticsArray = await Promise.all(analyticsPromises);

    // Flatten the array of analytics
    const allAnalytics = [].concat(...analyticsArray);

    // Count countries and cities
    const locationCounts = allAnalytics.reduce((acc, analytics) => {
      const { country, city } = analytics.location || { country: 'Unknown', city: 'Unknown' };

      // Count countries
      acc.countries[country] = (acc.countries[country] || 0) + 1;

      // Count cities
      acc.cities[city] = (acc.cities[city] || 0) + 1;

      return acc;
    }, { countries: {}, cities: {} });

    // Convert location counts to the required format
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

// Controller to get top locations (cities) for all URLs of a user
const topLocations = async (req, res) => {
  try {
    const userId = req.user;

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

// Controller to get clicks with dates for all URLs of a user
const clicksWithDates = async (req, res) => {
  const userId = req.user;

  try {
    const userUrls = await Url.find({ user: userId });

    const clickDataPromises = userUrls.map(async (url) => {
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

      const formattedData = clickData.map(data => ({
        date: data._id,
        clicks: data.count,
      }));

      return formattedData;
    });

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

module.exports = {
  totalClicks,
  deviceClicks,
  referrerClicks,
  allLocations,
  topLocations,
  clicksWithDates
};
