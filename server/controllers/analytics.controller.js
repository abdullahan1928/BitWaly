// controller file that fetches all analytics data for a specific URL
const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');
const FormerUrl = require('../models/FormerUrl');

// Controller to fetch all analytics data for a specific URL
const allAnalyticsController = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlDocument = await Url.findOne({ shortUrl });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id })
      .sort({ accessedAt: 1 });

    // Format analytics data
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

// Controller to fetch weekly click count for a URL
const weeklyCountController = async (req, res) => {
  const { id } = req.params;

  try {
    // Calculate start date for the past 7 days
    const startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);

    // Count documents with accessedAt greater than or equal to start date
    const clickData = await Analytics.countDocuments({
      url: id,
      accessedAt: { $gte: startDate }
    });

    res.json({ clickData });
  } catch (error) {
    console.error('Error in fetching click data:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch percentage change in weekly click count for a URL
const weeklyChangeController = async (req, res) => {
  const { id } = req.params;

  try {
    // Calculate start date for the past 7 days
    const startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);

    // Count total clicks in the last 7 days
    const totalClicksLast7Days = await Analytics.countDocuments({
      url: id,
      accessedAt: { $gte: startDate }
    });

    // Count total clicks in the week before last 7 days
    const totalClicksPreviousWeek = await Analytics.countDocuments({
      url: id,
      accessedAt: { $lt: startDate, $gte: new Date(startDate - 7 * 24 * 60 * 60 * 1000) }
    });

    // Calculate percentage change in click count
    const percentageChange = totalClicksPreviousWeek !== 0
      ? ((totalClicksLast7Days - totalClicksPreviousWeek) / totalClicksPreviousWeek) * 100
      : 100;

    res.json({ percentageChange });
  } catch (error) {
    console.error('Error in fetching click data:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch click data (date-wise) for a URL
const clicksController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id }) || await FormerUrl.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    // Aggregate click data grouped by date
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

    // Format click data
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

// Controller to fetch access count for a URL
const accessCountController = async (req, res) => {
  const { id } = req.params;

  try {
    const urlDocument = await Url.findById(id) || await FormerUrl.findById(id);

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    res.send(urlDocument.accessCount.toString());

  } catch (error) {
    console.error('Error in fetching click data:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch browser analytics for a URL
const browserAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id }) || await FormerUrl.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    // Extract browsers from analytics data
    const browsers = analyticsData.map(data => data.browser);

    res.json(browsers);
  } catch (error) {
    console.error('Error in fetching browser analytics:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch OS analytics for a URL
const osAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id }) || await FormerUrl.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    // Extract operating systems from analytics data
    const operatingSystems = analyticsData.map(data => data.operatingSystem);

    // Send operating systems in response
    res.json(operatingSystems);
  } catch (error) {
    console.error('Error in fetching OS analytics:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch device analytics for a URL
const deviceAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    // Find the URL document by ID and user
    const urlDocument = await Url.findById({ user: userId, _id: id }) || await FormerUrl.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    // Extract devices from analytics data
    const devices = analyticsData.map(data => ({ device: data.device, date: data.accessedAt }));

    res.json(devices);
  } catch (error) {
    console.error('Error in fetching mobile device vendor analytics:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch mobile vendor analytics for a URL
const mobileAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id }) || await FormerUrl.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    // Extract vendors from analytics data
    const vendors = analyticsData.map(data => data.vendor);

    res.json(vendors);
  } catch (error) {
    console.error('Error in fetching mobile device vendor analytics:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch location analytics for a URL
const locationAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id }) || await FormerUrl.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    // Format location analytics data
    const formattedData = analyticsData.map(data => ({
      date: data.accessedAt,
      country: data.location.country,
      city: data.location.city,
      count: data.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error in fetching location analytics:', error);
    res.status(500).send('Server error');
  }
};

// Controller to fetch referrer analytics for a URL
const referrerAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id }) || await FormerUrl.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

    // Extract referrers from analytics data
    const referrers = analyticsData.map(data => ({ referrer: data.referrer, date: data.accessedAt }));

    res.json(referrers);
  } catch (error) {
    console.error('Error in fetching referrer analytics:', error);
    res.status(500).send('Server error');
  }
}

module.exports = {
  allAnalyticsController,
  clicksController,
  browserAnalyticsController,
  osAnalyticsController,
  deviceAnalyticsController,
  mobileAnalyticsController,
  locationAnalyticsController,
  accessCountController,
  weeklyCountController,
  weeklyChangeController,
  referrerAnalyticsController
};
