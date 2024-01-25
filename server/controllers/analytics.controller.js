const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');

exports.allAnalyticsController = async (req, res) => {
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


exports.clicksController = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlDocument = await Url.findOne({ shortUrl });

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

