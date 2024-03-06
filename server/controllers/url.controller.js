const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const axios = require('axios');
const Analytics = require('../models/Analytics.model');
const { getCountry } = require('iso-3166-1-alpha-2');
const { getTitleAndImageFromUrl, checkAndUpdateTags, generateUniqueShortUrl } = require('../helper/url.helper');

const LOCATION_API_KEY = process.env.LOCATION_API_KEY;

const shortenUrl = async (req, res) => {
  const { origUrl, customUrl, title, tags, utmSource, utmMedium, utmCampaign, utmTerm, utmContent } = req.body;

  const user = req.user;

  const originalUrl = utmSource && utmMedium && utmCampaign
    ? origUrl + `?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}` +
    (utmTerm ? `&utm_term=${utmTerm}` : '') +
    (utmContent ? `&utm_content=${utmContent}` : '')
    : origUrl;

  try {
    const existingUserUrl = await Url.findOne({ originalUrl, user });

    if (existingUserUrl) {
      return res.status(409).send("You have already created a short URL for this destination URL.");
    }

    let { linkTitle, image } = await getTitleAndImageFromUrl(originalUrl, title);

    if (customUrl) {
      const existingUrl = await Url.findOne({ shortUrl: customUrl });

      if (existingUrl) {
        return res.status(409).send("Short URL already exists");
      }

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

const retrieveUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const shardKey = shortUrl[0].toLowerCase();

  try {
    const url = await Url.findOne({ shardKey, shortUrl });

    if (url) {
      console.log('Url access count before increment', url.accessCount);

      url.accessCount += 1;

      console.log('Url access count after increment', url.accessCount);

      await url.save();

      res.status(200).send({ originalUrl: url.originalUrl });

      const userIP = req.body.userIP || '192.168.10.1';

      const location = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${LOCATION_API_KEY}&ipAddress=${userIP}`);
      const country = getCountry(location.data.location.country);

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

const getUrlById = async (req, res) => {

  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userId = req.user;
    const { id } = req.params;

    const url = await Url.findById({ user: userId, _id: id });

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

const updateUrl = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userId = req.user;
    const { id } = req.params;
    const { origUrl, title, shortUrl, tags } = req.body;

    const existingUrl = await Url.findOne({ originalUrl: origUrl });

    if (existingUrl && existingUrl._id.toString() !== id) {
      return res.status(409).send("You have already created a short URL for this destination URL.");
    }

    const existingUrls = await Url.find({ shortUrl });
    const url = await Url.findOne({ user: userId, _id: id });

    if (existingUrls.length > 0 && shortUrl !== url.shortUrl) {
      return res.status(409).send("Short URL already exists");
    }

    if (url) {

      url.originalUrl = origUrl;

      if (shortUrl !== url.shortUrl) {
        url.isCustom = true;
        url.shortUrl = shortUrl;
        url.shardKey = shortUrl[0].toLowerCase();
      }

      let { linkTitle, image } = await getTitleAndImageFromUrl(origUrl, title);

      url.meta.image = image;
      url.meta.title = linkTitle;

      await url.save();

      await checkAndUpdateTags(userId, id, tags);

      return res.status(200).send(url);
    } else {
      return res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error processing your request");
  }
};

const deleteUrl = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const userId = req.user;
    const { id } = req.params;

    const deletedUrl = await Url.findByIdAndDelete({ user: userId, _id: id });

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

    await Analytics.deleteMany({ url: id });

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