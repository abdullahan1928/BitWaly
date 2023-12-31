const crypto = require('crypto');
const Url = require('../models/Url.model');

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
  const { originalUrl } = req.body;
  try {
    const { shortUrl, shardKey, totalTime, collisions } = await generateUniqueShortUrl(originalUrl);
    const newUrl = new Url({ originalUrl, shortUrl, shardKey, user: req.user });
    await newUrl.save();
    res.status(201).send({ shortUrl, totalTime, collisions });
  } catch (error) {
    res.status(500).send("Error processing your request");
  }
};

module.exports = shortenUrl;


const retrieveUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const shardKey = shortUrl[0].toLowerCase();

  const url = await Url.findOne({ shardKey, shortUrl });

  if (url) {
    url.accessCount += 1;
    url.accessDetails.push({
      ipAddress: req.ip,
      referrer: req.get('Referrer'),
      userAgent: req.get('User-Agent'),
    });
    await url.save();
    res.status(200).send(url);
  } else {
    res.status(404).send('URL not found');
  }
};

module.exports = { shortenUrl, retrieveUrl };