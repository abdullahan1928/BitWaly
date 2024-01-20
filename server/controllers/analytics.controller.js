const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');
const UAParser = require('ua-parser-js');

exports.clicksController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user;

    try {
        const urlDocument = await Url.findById({ user: userId, _id: id });

        if (!urlDocument) {
            return res.status(404).send('URL not found');
        }

        // Use the URL ID to query the Analytics collection
        const clickData = await Analytics.aggregate([
            { $match: { url: urlDocument._id } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$accessedAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Format the response
        const formattedData = clickData.map(data => ({
            date: data._id, // This is the formatted date string
            clicks: data.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error in fetching click data:', error);
        res.status(500).send('Server error');
    }
};


exports.browserAnalyticsController = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const urlDocument = await Url.findOne({ shortUrl });
        if (!urlDocument) {
            return res.status(404).send('URL not found');
        }

        const analyticsData = await Analytics.find({ url: urlDocument._id });
        const browserData = {};

        analyticsData.forEach(data => {
            if (data.userAgent) {
                const userAgent = new UAParser(data.userAgent);
                const browserName = userAgent.getBrowser().name;

                if (!browserData[browserName]) {
                    browserData[browserName] = 0;
                }

                browserData[browserName]++;
            }
        });

        res.json(browserData);
    } catch (error) {
        console.error('Error in fetching browser analytics:', error);
        res.status(500).send('Server error');
    }
};

exports.osAnalyticsController = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const urlDocument = await Url.findOne({ shortUrl });
        if (!urlDocument) {
            return res.status(404).send('URL not found');
        }

        const analyticsData = await Analytics.find({ url: urlDocument._id });
        const osData = {};

        analyticsData.forEach(data => {
            if (data.userAgent) {
                const userAgent = new UAParser(data.userAgent);
                const osName = userAgent.getOS().name;

                if (!osData[osName]) {
                    osData[osName] = 0;
                }

                osData[osName]++;
            }
        });

        res.json(osData);
    } catch (error) {
        console.error('Error in fetching OS analytics:', error);
        res.status(500).send('Server error');
    }
};


exports.deviceAnalyticsController = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const urlDocument = await Url.findOne({ shortUrl });
        if (!urlDocument) {
            return res.status(404).send('URL not found');
        }

        const analyticsData = await Analytics.find({ url: urlDocument._id });
        const deviceData = {};

        analyticsData.forEach(data => {
            if (data.userAgent) {
                const userAgent = new UAParser(data.userAgent);
                const deviceType = userAgent.getDevice().type;

                if (!deviceData[deviceType]) {
                    deviceData[deviceType] = 0;
                }

                deviceData[deviceType]++;
            }
        });

        res.json(deviceData);
    } catch (error) {
        console.error('Error in fetching device analytics:', error);
        res.status(500).send('Server error');
    }
};
