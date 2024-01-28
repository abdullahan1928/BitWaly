const crypto = require('crypto');
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');
const axios = require('axios');
const Analytics = require('../models/Analytics.model');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { getCountry } = require('iso-3166-1-alpha-2')

const LOCATION_API_KEY = process.env.LOCATION_API_KEY;

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
  const { originalUrl, customUrl, title, tags } = req.body;

  try {
    const html = await (await fetch(originalUrl)).text();

    const $ = cheerio.load(html);

    const linkTitle = title || $('head title').text() || originalUrl.split('/')[2] + '- untitled';

    const image = $('head link[rel="icon"]').attr('href') || $('head link[rel="shortcut icon"]').attr('href');

    let tagIds = [];

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
        user: req.user,
        meta: { title: linkTitle, image },
        isCustom: true,
      });
      await newUrl.save();

      if (tags && tags.length > 0) {
        for (const tag of tags) {
          const newTag = new Tag({
            user: req.user,
            name: tag,
            urls: [newUrl._id]
          });
          await newTag.save();
          tagIds.push(newTag._id);
        }
      }

      for (const tagId of tagIds) {
        newUrl.tags.push(tagId);
      }

      res.status(201).send({ shortUrl });
    } else {
      const { shortUrl, shardKey, totalTime, collisions } = await generateUniqueShortUrl(originalUrl);

      const newUrl = new Url({
        originalUrl,
        shortUrl,
        shardKey,
        user: req.user,
        meta: { title: linkTitle, image },
        isCustom: false,
      });
      await newUrl.save();

      if (tags && tags.length > 0) {
        for (const tag of tags) {
          const newTag = new Tag({
            user: req.user,
            name: tag,
            urls: [newUrl._id]
          });
          await newTag.save();
          tagIds.push(newTag._id);
        }
      }

      for (const tagId of tagIds) {
        newUrl.tags.push(tagId);
      }

      res.status(201).send({ shortUrl, totalTime, collisions });
    }
  } catch (error) {
    res.status(500).send("Error processing your request");
  }
};

const retrieveUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const shardKey = shortUrl[0].toLowerCase();

  //API requures credits. Use it wisely. :)
  let location = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=${LOCATION_API_KEY}&ipAddress=${req.body.userIP}`);

  location.data.location.country = getCountry(location.data.location.country);

  try {
    const url = await Url.findOne({ shardKey, shortUrl });

    if (url) {
      url.accessCount += 1;

      const analyticsData = new Analytics({
        url: url._id,
        accessedAt: new Date(),
        ipAddress: req.body.userIP,
        browser: req.body.browserName,
        operatingSystem: req.body.osName,
        device: req.body.deviceType,
        vendor: req.body.mobileVendor,
        referrer: req.get('Referrer'),
        userAgent: req.get('User-Agent'),
        location: location.data
      });

      await analyticsData.save();

      await url.save();

      res.status(200).send(url);
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

    const existingUrls = await Url.find({ shortUrl });
    const url = await Url.findOne({ user: userId, _id: id });

    if (existingUrls.length > 0 && shortUrl !== url.shortUrl) {
      return res.status(409).send("Short URL already exists");
    }

    if (url) {
      if (shortUrl !== url.shortUrl) {
        url.isCustom = true;
      }

      url.shortUrl = shortUrl;
      url.shardKey = shortUrl[0].toLowerCase();
      url.meta.title = title;

      await url.save();

      const existingTags = await Tag.find({ user: userId });

      for (const existingTag of existingTags) {
        if (!tags || !tags.includes(existingTag.name)) {
          existingTag.urls = existingTag.urls.filter((urlId) => urlId === id);

          if (existingTag.urls.length === 0) {
            await Tag.findByIdAndDelete(existingTag._id);
          } else {
            await existingTag.save();
          }
        }
      }

      if (tags && tags.length > 0) {
        console.log('In if');
        for (const tag of tags) {
          console.log('In for');
          const existingTag = existingTags.find((t) => t.name === tag);

          if (existingTag) {
            console.log('In inner if');
            if (!existingTag.urls.includes(id)) {
              console.log('In inner if if');
              existingTag.urls.push(id);
              await existingTag.save();
            }
          } else {
            console.log('In inner else');
            const newTag = new Tag({
              user: userId,
              name: tag,
              urls: [id]
            });
            await newTag.save();
          }

          if (!url.tags.includes(existingTag._id)) {
            url.tags.push(existingTag._id);
            await url.save();
          }
        }
      }

      return res.status(200).send(url);
    } else {
      return res.status(404).send("URL not found");
    }

  } catch (error) {
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
      tag.urls = tag.urls.filter((urlId) => urlId === id);

      if (tag.urls.length === 0) {
        await Tag.findByIdAndDelete(tag._id);
      } else {
        await tag.save();
      }
    }

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