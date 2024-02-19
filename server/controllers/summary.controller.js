const Url = require('../models/Url.model');
const Analytics = require('../models/Analytics.model');
const totalClicks = async (req, res) => { 
    const userId = req.user
    try {    
        const userUrls = await Url.find({ user: userId });
    
        const totalClicks = userUrls.reduce((acc, url) => acc + url.accessCount, 0);

        const firstLinkDate = userUrls.length > 0 ? userUrls[0].createdAt : null;
    
        res.status(200).json({ totalClicks, firstLinkDate });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}


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
    
        // Count devices
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

const referrerClicks = async (req, res) => {
    try {
        const userId = req.user;
    
        // Find all URLs created by the user
        const userUrls = await Url.find({ user: userId });
    
        console.log('User URLs:', userUrls);
    
        // Extract analytics for each URL
        const analyticsPromises = userUrls.map(async (url) => {
          return await Analytics.find({ url: url._id });
        });
    
        const analyticsArray = await Promise.all(analyticsPromises);
    
        console.log('All Analytics:', analyticsArray);
    
        // Flatten the array of analytics
        const allAnalytics = [].concat(...analyticsArray);
    
        console.log('Flattened Analytics:', allAnalytics);
    
        // Count referrers
        const referrerCounts = allAnalytics.reduce((acc, analytics) => {
          const referrer = analytics.referrer || 'Direct';
          acc[referrer] = (acc[referrer] || 0) + 1;
          return acc;
        }, {});
    
        console.log('Referrer Counts:', referrerCounts);
    
        // Convert referrer counts to the required format for a pie graph
        const referrerData = Object.entries(referrerCounts).map(([referrer, count]) => ({ referrer, count }));
    
        res.status(200).json(referrerData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}


const allLocations = async (req, res) => {
    try {
        const userId = req.user;
    
        // Find all URLs created by the user
        const userUrls = await Url.find({ user: userId });
    
        console.log('User URLs:', userUrls);
    
        // Extract analytics for each URL
        const analyticsPromises = userUrls.map(async (url) => {
          return await Analytics.find({ url: url._id });
        });
    
        const analyticsArray = await Promise.all(analyticsPromises);
    
        console.log('All Analytics:', analyticsArray);
    
        // Flatten the array of analytics
        const allAnalytics = [].concat(...analyticsArray);
    
        console.log('Flattened Analytics:', allAnalytics);
    
        // Count countries and cities
        const locationCounts = allAnalytics.reduce((acc, analytics) => {
          const { country, city } = analytics.location || { country: 'Unknown', city: 'Unknown' };
    
          // Count countries
          acc.countries[country] = (acc.countries[country] || 0) + 1;
    
          // Count cities
          acc.cities[city] = (acc.cities[city] || 0) + 1;
    
          return acc;
        }, { countries: {}, cities: {} });
    
        console.log('Location Counts:', locationCounts);
    
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

module.exports = { totalClicks, deviceClicks, referrerClicks, allLocations };
