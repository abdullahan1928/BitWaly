//main body of the app. controllers and algorithms for url shortening, retrieval, analytics, etc.
const axios = require('axios');
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const Analytics = require('../models/Analytics.model');
const FormerUrl = require('../models/FormerUrl');
const { getCountry } = require('iso-3166-1-alpha-2');
const { getTitleAndImageFromUrl, checkAndUpdateTags, generateUniqueShortUrl } = require('../helper/url.helper');

const LOCATION_API_KEY = process.env.LOCATION_API_KEY;

// Function to shorten a URL
const shortenUrl = async (req, res) => {
  const { origUrl, customUrl, title, tags, utmSource, utmMedium, utmCampaign, utmTerm, utmContent } = req.body;

  const user = req.user;

  // Appending UTM parameters to the original URL if provided
  const originalUrl = utmSource && utmMedium && utmCampaign
    ? origUrl + `?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}` +
    (utmTerm ? `&utm_term=${utmTerm}` : '') +
    (utmContent ? `&utm_content=${utmContent}` : '')
    : origUrl;

  try {
    // Checking if the user has already shortened the same URL
    const existingUserUrl = await Url.findOne({ originalUrl, user });

    if (existingUserUrl) {
      return res.status(409).send("You have already created a short URL for this destination URL.");
    }

    // Retrieving title and image for the URL
    let { linkTitle, image } = await getTitleAndImageFromUrl(originalUrl, title);

    if (customUrl) {
      // If custom URL is provided
      const existingUrl = await Url.findOne({ shortUrl: customUrl });

      if (existingUrl) {
        return res.status(409).send("Short URL already exists");
      }

      // Creating a new URL object with custom URL
      const shortUrl = customUrl;
      const shardKey = shortUrl[0].toLowerCase();

      const newUrl = new Url({
        originalUrl,
        shortUrl,
        shardKey,
        user,
        meta: { title: linkTitle, image },
        isCustom: true,
      });
      await newUrl.save();

      checkAndUpdateTags(user, newUrl._id, tags);

      res.status(201).send({ shortUrl });
    } else {
      // Generating a unique short URL if custom URL is not provided
      const { shortUrl, shardKey, totalTime, collisions } = await generateUniqueShortUrl(originalUrl);

      const newUrl = new Url({
        originalUrl,
        shortUrl,
        shardKey,
        user,
        meta: { title: linkTitle, image },
        isCustom: false,
      });
      await newUrl.save();

      checkAndUpdateTags(user, newUrl._id, tags);

      res.status(201).send({ shortUrl, totalTime, collisions });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error processing your request");
  }
};

// Function to retrieve the original URL from a short URL
const retrieveUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const shardKey = shortUrl[0].toLowerCase();

  try {
    const url = await Url.findOne({ shardKey, shortUrl });

    if (url) {
      // Incrementing access count for the URL
      url.accessCount += 1;
      await url.save();

      res.status(200).send({ originalUrl: url.originalUrl });

      // Retrieving user's IP address and location information
      const userIP = req.body.userIP || '192.168.10.1';
      const location = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${LOCATION_API_KEY}&ipAddress=${userIP}`);
      const country = getCountry(location.data.location.country);

      // Storing analytics data for the URL access
      const analyticsData = new Analytics({
        url: url._id,
        accessedAt: new Date(),
        ipAddress: userIP,
        browser: req.body.browserName,
        operatingSystem: req.body.osName,
        device: req.body.deviceType,
        vendor: req.body.mobileVendor,
        referrer: req.body.referrer,
        userAgent: req.get('User-Agent'),
        location: location.data.location,
        country: country,
        utmSource: req.query.utm_source || req.params.utm_source || '',
        utmMedium: req.query.utm_medium || '',
        utmCampaign: req.query.utm_campaign || '',
        utmTerm: req.query.utm_term || '',
        utmContent: req.query.utm_content || '',
      });

      await analyticsData.save();
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Function to retrieve a URL by its ID
const getUrlById = async (req, res) => {

  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userId = req.user;
    const { id } = req.params;

    const url = await Url.findById({ user: userId, _id: id });

    // Finding tags associated with the URL
    const tags = await Tag.find({
      user: userId,
      urls: { $elemMatch: { $eq: id } }
    });

    const tagNames = tags.map(tag => tag.name);

    const data = {
      url,
      tags: tagNames
    }

    if (url) {
      return res.status(200).send(data);
    } else {
      return res.status(404).send("URL not found");
    }
  } catch (error) {
    return res.status(500).send("Error processing your request");
  }
};

// Function to retrieve all URLs created by a user
const retrieveUrlsForUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userId = req.user;

    const userUrls = await Url.find({ user: userId });

    if (userUrls.length > 0) {
      res.status(200).send(userUrls);
    } else {
      res.status(404).send('No URLs found for the user');
    }
  } catch (error) {
    res.status(500).send("Error processing your request");
  }
};

// Function to update a URL
// const updateUrl = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).send("Unauthorized");
//     }

//     const userId = req.user;
//     const { id } = req.params;
//     const { origUrl, title, shortUrl, tags } = req.body;

//     // Find the current URL
//     const url = await Url.findOne({ user: userId, _id: id });

//     if (!url) {
//       return res.status(404).send("URL not found");
//     }

//     // Check if the new custom short URL conflicts with existing ones
//     if (shortUrl !== url.shortUrl) {
//       const existingUrl = await Url.findOne({ shortUrl });
//       if (existingUrl && existingUrl._id.toString() !== id) {
//         return res.status(409).send("Short URL already exists");
//       }
//     }

//     // Check if the original URL is being changed
//     if (origUrl !== url.originalUrl) {
//       // If original URL is being changed, move the current URL to formerUrls array
//       const formerUrl = new FormerUrl({
//         user: url.user,
//         originalUrl: url.originalUrl,
//         createdAt: url.createdAt,
//         completedAt: new Date(),
//         accessCount: 0,
//         shardKey: url.shardKey,
//         meta: url.meta,
//         isCustom: url.isCustom,
//         tags: url.tags,
//       });

//       await formerUrl.save();

//       // Add the former URL to the current URL's formerUrls array
//       url.formerUrls.push(formerUrl._id);

//       // Update URL details with new values
//       url.originalUrl = origUrl;
//       url.shortUrl = shortUrl;
//       url.shardKey = shortUrl[0].toLowerCase();

//       // Update meta details if necessary
//       const { linkTitle, image } = await getTitleAndImageFromUrl(origUrl, '');
//       if (linkTitle !== url.meta.title || image !== url.meta.image) {
//         url.meta.title = linkTitle;
//         url.meta.image = image;
//       }
//     } else {
//       // If original URL is not being changed, update URL details without moving it to formerUrls array
//       url.shortUrl = shortUrl;
//       url.shardKey = shortUrl[0].toLowerCase();
//       // Update meta details if necessary
//       if (title !== url.meta.title) {
//         url.meta.title = title;
//       }
//     }

//     // Save the updated URL
//     await url.save();

//     // Update tags associated with the URL
//     await checkAndUpdateTags(userId, id, tags);

//     return res.status(200).send(url);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Error processing your request");
//   }
// };

const updateUrl = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userId = req.user;
    const { id } = req.params;
    const { origUrl, title, shortUrl, tags } = req.body;

    // Find the current URL
    const url = await Url.findOne({ user: userId, _id: id });

    if (!url) {
      return res.status(404).send("URL not found");
    }

    // Check if the new custom short URL conflicts with existing ones
    if (shortUrl !== url.shortUrl) {
      const existingUrl = await Url.findOne({ shortUrl });
      if (existingUrl && existingUrl._id.toString() !== id) {
        return res.status(409).send("Short URL already exists");
      }
    }

    // Check if the original URL is being changed
    if (origUrl !== url.originalUrl) {
      // Move the current URL to formerUrls array
      const formerUrl = new FormerUrl({
        user: url.user,
        originalUrl: url.originalUrl,
        createdAt: url.createdAt,
        completedAt: new Date(),
        accessCount: url.accessCount,
        shardKey: url.shardKey,
        meta: url.meta,
        isCustom: url.isCustom,
        tags: url.tags,
      });

      await formerUrl.save();

      // Update formerUrl analytics to reference the new URL
      await Analytics.updateMany({ url: url._id }, { url: formerUrl._id });

      // Add the former URL to the current URL's formerUrls array
      url.formerUrls.push(formerUrl._id);

      // Update URL details with new values
      url.originalUrl = origUrl;
      url.shortUrl = shortUrl;
      url.shardKey = shortUrl[0].toLowerCase();
      url.accessCount = 0;

      const { linkTitle, image } = await getTitleAndImageFromUrl(origUrl, '');
      if (linkTitle !== url.meta.title || image !== url.meta.image) {
        url.meta.title = linkTitle;
        url.meta.image = image;
      }

    } else {
      // If original URL is not being changed, update URL details without moving it to formerUrls array
      url.shortUrl = shortUrl;
      url.shardKey = shortUrl[0].toLowerCase();
      // Update meta details if necessary
      if (title !== url.meta.title) {
        url.meta.title = title;
      }
    }

    // Save the updated URL
    await url.save();

    // Update tags associated with the URL
    await checkAndUpdateTags(userId, id, tags);

    return res.status(200).send(url);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error processing your request");
  }
};

// Function to delete a URL
const deleteUrl = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userId = req.user;
    const { id } = req.params;

    // Deleting the URL by ID and user
    const deletedUrl = await Url.findById({ user: userId, _id: id });

    const formerUrls = deletedUrl.formerUrls;

    if (formerUrls.length > 0) {
      // Deleting former URLs associated with the URL
      await FormerUrl.deleteMany({ _id: { $in: formerUrls } });
    }

    // Finding tags associated with the URL and updating them
    const tags = await Tag.find({
      user: userId,
      urls: { $elemMatch: { $eq: id } }
    });

    for (const tag of tags) {

      tag.urls = tag.urls.filter((urlId) => urlId.toString() !== id);

      if (tag.urls.length === 0) {
        await Tag.findByIdAndDelete(tag._id);
      } else {
        await tag.save();
      }
    }

    // Deleting analytics data associated with the URL
    await Analytics.deleteMany({ url: id });

    // Deleting analytics data associated with the former URLs
    for (const formerUrl of formerUrls) {
      await Analytics.deleteMany({ url: formerUrl });
    }

    // Deleting the URL
    await Url.findByIdAndDelete(id);

    if (deletedUrl) {
      return res.status(200).send("URL deleted successfully");
    } else {
      return res.status(404).send("URL not found");
    }
  } catch (error) {
    return res.status(500).send("Error processing your request");
  }
};

module.exports = {
  shortenUrl,
  retrieveUrl,
  retrieveUrlsForUser,
  deleteUrl,
  getUrlById,
  updateUrl
};
