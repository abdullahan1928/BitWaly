const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');
const mongoose = require('mongoose');

const allAnalyticsController = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlDocument = await Url.findOne({ shortUrl });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    // Use the URL ID to query the Analytics collection
    const analyticsData = await Analytics.find({ url: urlDocument._id })
      .sort({ accessedAt: 1 }); // Sort by accessedAt date in ascending order

    // Format the response
    const formattedData = analyticsData.map(data => ({
      date: data.accessedAt,
      ipAddress: data.ipAddress,
      referrer: data.referrer,
      userAgent: data.userAgent,
      device: data.device,
      browser: data.browser,
      operatingSystem: data.operatingSystem,
      location: data.location,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error in fetching date analytics:', error);
    res.status(500).send('Server error');
  }
};

const weeklyCountController = async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);

const clickData = await Analytics.countDocuments({
  url: id,
  accessedAt: { $gte: startDate }
});

console.log("Total Clicks in Last 7 Days:", clickData);
    res.json({ clickData });
  } catch (error) {
    console.error('Error in fetching click data:', error);
    res.status(500).send('Server error');
  }
};

const clicksController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const clickData = await Analytics.aggregate([
      { $match: { url: urlDocument._id } },
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

    res.json(formattedData);
  } catch (error) {
    console.error('Error in fetching click data:', error);
    res.status(500).send('Server error');
  }
};


const accessCountController = async (req, res) => {
  const { id } = req.params;

  try {
    const urlDocument = await Url.findById(id);

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    res.send(urlDocument.accessCount.toString());

  } catch (error) {
    console.error('Error in fetching click data:', error);
    res.status(500).send('Server error');
  }
}

const browserAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    const browsers = analyticsData.map(data => data.browser);

    res.json(browsers);
  } catch (error) {
    console.error('Error in fetching browser analytics:', error);
    res.status(500).send('Server error');
  }
};


const osAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    const operatingSystems = analyticsData.map(data => data.operatingSystem);

    res.json(operatingSystems);
  } catch (error) {
    console.error('Error in fetching OS analytics:', error);
    res.status(500).send('Server error');
  }
};

const deviceAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id });
    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    const devices = analyticsData.map(data => data.device);

    res.json(devices);
  } catch (error) {
    console.error('Error in fetching mobile device vendor analytics:', error);
    res.status(500).send('Server error');
  }
};


const mobileAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    const vendors = analyticsData.map(data => data.vendor);

    res.json(vendors);
  } catch (error) {
    console.error('Error in fetching mobile device vendor analytics:', error);
    res.status(500).send('Server error');
  }
};


const locationAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    const locations = analyticsData.reduce((acc, data) => {
      const { country, city } = data.location;

      if (!acc.countryCounts[country]) {
        acc.countryCounts[country] = 1;
      } else {
        acc.countryCounts[country] += 1;
      }

      if (!acc.cityCounts[city]) {
        acc.cityCounts[city] = 1;
      } else {
        acc.cityCounts[city] += 1;
      }

      return acc;
    }, { countryCounts: {}, cityCounts: {} });

    const formattedData = {
      countries: Object.keys(locations.countryCounts).map(country => ({
        country,
        count: locations.countryCounts[country],
      })),
      cities: Object.keys(locations.cityCounts).map(city => ({
        city,
        count: locations.cityCounts[city],
      })),
    };

    res.json(formattedData);
  } catch (error) {
    console.error('Error in fetching location analytics:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  allAnalyticsController,
  clicksController,
  browserAnalyticsController,
  osAnalyticsController,
  deviceAnalyticsController,
  mobileAnalyticsController,
  locationAnalyticsController,
  accessCountController,
  weeklyCountController
};


