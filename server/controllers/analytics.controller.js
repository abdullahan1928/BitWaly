const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');

const allAnalyticsController = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlDocument = await Url.findOne({ shortUrl });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id })
      .sort({ accessedAt: 1 });

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

  try {
    const startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);

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

const weeklyChangeController = async (req, res) => {
  const { id } = req.params;

  try {
    const startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);

    const totalClicksLast7Days = await Analytics.countDocuments({
      url: id,
      accessedAt: { $gte: startDate }
    });

    const totalClicksPreviousWeek = await Analytics.countDocuments({
      url: id,
      accessedAt: { $lt: startDate, $gte: new Date(startDate - 7 * 24 * 60 * 60 * 1000) }
    });

    const percentageChange = totalClicksPreviousWeek !== 0
      ? ((totalClicksLast7Days - totalClicksPreviousWeek) / totalClicksPreviousWeek) * 100
      : 100;

    res.json({ percentageChange });
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

    console.log(clickData);

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

    const devices = analyticsData.map(data => ({ device: data.device, date: data.accessedAt }));

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

const referrerAnalyticsController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;

  try {
    const urlDocument = await Url.findById({ user: userId, _id: id });

    if (!urlDocument) {
      return res.status(404).send('URL not found');
    }

    const analyticsData = await Analytics.find({ url: urlDocument._id });

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


