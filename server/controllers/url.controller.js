const crypto = require('crypto');
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const axios = require('axios');
const Analytics = require('../models/Analytics.model');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { getCountry } = require('iso-3166-1-alpha-2')

const LOCATION_API_KEY = process.env.LOCATION_API_KEY;

async function checkAndUpdateTags(userId, urlId, tags) {
  const existingUrl = await Url.findOne({ user: userId, _id: urlId });

  if (existingUrl) {
    await updateTagsForUrl(userId, urlId, tags);
  } else {
    return res.status(404).send("URL not found");
  }
};

async function updateTagsForUrl(userId, urlId, tags) {
  const existingTags = await Tag.find({ user: userId });
  const url = await Url.findOne({ user: userId, _id: urlId });

  // Remove tags that are no longer associated with the URL
  for (const existingTag of existingTags) {

    if (!tags.includes(existingTag.name)) {

      existingTag.urls = existingTag.urls.filter((urlId) =>
        urlId.toString() !== url._id.toString()
      );

      if (existingTag.urls.length === 0) {
        await Tag.findByIdAndDelete(existingTag._id);
      } else {
        await existingTag.save();
      }
    } else {
      if (!url.tags.includes(existingTag._id)) {
        url.tags.push(existingTag._id);
      }
    }
  }

  // Remove tag ids from the URL that are no longer associated with it
  url.tags = url.tags.filter((tagId) => {
    const tag = existingTags.find((t) => t._id.toString() === tagId.toString());

    if (tag) {
      return tags.includes(tag.name);
    } else {
      return false;
    }
  });

  // Add new tags and update existing ones
  if (tags && tags.length > 0) {

    for (const tag of tags) {

      const existingTag = existingTags.find((t) => t.name === tag);

      if (existingTag) {
        if (!existingTag.urls.includes(urlId)) {
          existingTag.urls.push(urlId);
          await existingTag.save();

          if (!url.tags.includes(existingTag._id)) {
            url.tags.push(existingTag._id);
          }
        }
      } else {
        const newTag = new Tag({
          user: userId,
          name: tag,
          urls: [urlId],
        });
        await newTag.save();

        url.tags.push(newTag._id);
      }

    }
  }

  await url.save();
};

function generateBaseHash(originalUrl) {
  const fullHash = crypto.createHash('md5').update(originalUrl).digest('hex');
  let shortHash = '';
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * fullHash.length);
    shortHash += fullHash[randomIndex];
  }
  return shortHash;
}

function modifyHash(hash) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomChar = chars[Math.floor(Math.random() * chars.length)];
  const replaceIndex = Math.floor(Math.random() * hash.length);
  return hash.substring(0, replaceIndex) + randomChar + hash.substring(replaceIndex + 1);
}

async function generateUniqueShortUrl(originalUrl) {
  const startTime = new Date();

  const shortUrl = generateBaseHash(originalUrl);
  const shardKey = shortUrl[0].toLowerCase();

  let uniqueShortUrl = shortUrl;
  let collisions = 0;

  while (await Url.exists({ shardKey, shortUrl: uniqueShortUrl })) {
    uniqueShortUrl = modifyHash(uniqueShortUrl);
    collisions++;
  }

  const endTime = new Date();
  const totalTime = (endTime - startTime) / 1000;

  return { shortUrl: uniqueShortUrl, shardKey, totalTime, collisions };
}


const shortenUrl = async (req, res) => {
  const { origUrl, customUrl, title, tags, utmSource, utmMedium, utmCampaign, utmTerm, utmContent } = req.body;

  const user = req.user; // Assuming you have the user object available in req.user

  
  const originalUrl = utmSource && utmMedium && utmCampaign && utmTerm && utmContent
  ? origUrl + `?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_term=${utmTerm}&utm_content=${utmContent}`
  : origUrl;

  try {
    const existingUserUrl = await Url.findOne({ originalUrl, user });

    if (existingUserUrl) {
      // return res.status(200).send({ shortUrl: existingUserUrl.shortUrl });
      return res.status(409).send("You have already created a short URL for this destination URL.");
    }

    console.log(originalUrl)

    const html = await (await fetch(originalUrl)).text();
    const $ = cheerio.load(html);

    const linkTitle = title || $('head title').text() || originalUrl.split('/')[2] + '- untitled';

    let image = $('head link[rel="icon"]').attr('href') || $('head link[rel="shortcut icon"]').attr('href') || $('head meta[property="og:image"]').attr('content') || $('head meta[name="twitter:image"]').attr('content') || $('head meta[itemprop="image"]').attr('content') || $('head meta[name="image"]').attr('content') || $('head meta[name="twitter:image:src"]').attr('content') || $('head meta[name="twitter:image"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content');

    if (!image.startsWith('http') && !image.startsWith('https')) {
      const domain = originalUrl.match(/^https?:\/\/[^/]+/)[0];
      image = domain + '/' + image;
    }

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
      // Increment accessCount
      url.accessCount += 1;

      // Save the updated URL without waiting for analytics data
      await url.save();

      // Respond with the original URL immediately
      res.status(200).send({ originalUrl: url.originalUrl });

      // Now proceed with analytics
      const userIP = req.body.userIP || '192.168.10.1';

      // Fetch location data
      const location = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${LOCATION_API_KEY}&ipAddress=${userIP}`);
      const country = getCountry(location.data.location.country);

      // Create analytics data
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
      });

      // Save analytics data
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
    const { title, shortUrl, tags } = req.body;
    console.log(tags)

    const existingUrls = await Url.find({ shortUrl });
    const url = await Url.findOne({ user: userId, _id: id });

    if (existingUrls.length > 0 && shortUrl !== url.shortUrl) {
      return res.status(409).send("Short URL already exists");
    }

    if (url) {
      if (shortUrl !== url.shortUrl) {
        url.isCustom = true;
        url.shortUrl = shortUrl;
        url.shardKey = shortUrl[0].toLowerCase();
      }

      url.meta.title = title;

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