const mongoose = require('mongoose');
const crypto = require('crypto');
const Url = require('../models/Url.model');

// Function to generate a base hash for the short URL
function generateBaseHash(originalUrl) {
  const fullHash = crypto.createHash('md5').update(originalUrl).digest('hex');
  let shortHash = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * fullHash.length);
    shortHash += fullHash[randomIndex];
  }
  return shortHash;
}

// Function to modify a hash by replacing a random character
function modifyHash(hash) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomChar = chars[Math.floor(Math.random() * chars.length)];
  const replaceIndex = Math.floor(Math.random() * hash.length);
  return hash.substring(0, replaceIndex) + randomChar + hash.substring(replaceIndex + 1);
}

// Function to generate a unique short URL
async function generateUniqueShortUrl(originalUrl) {
  const shortUrl = generateBaseHash(originalUrl);
  const shardKey = shortUrl[0].toLowerCase();

  let uniqueShortUrl = shortUrl;
  while (await Url.exists({ shardKey, shortUrl: uniqueShortUrl })) {
    uniqueShortUrl = modifyHash(uniqueShortUrl);
  }

  return { shortUrl: uniqueShortUrl, shardKey };
}

// API endpoint to generate and store 1000 dummy entries
const DummyData = async (req, res) => {
  try {
    const numEntries = 10000;
    console.log(`Generating and storing ${numEntries} dummy entries...`);

    for (let i = 0; i < numEntries; i++) {
      const randomSearchQuery = generateRandomSearchQuery();
      const { shortUrl, shardKey } = await generateUniqueShortUrl(randomSearchQuery);

      const newUrl = new Url({ originalUrl: randomSearchQuery, shortUrl, shardKey });
      await newUrl.save();

      console.log(`Entry ${i + 1}/${numEntries} saved: ${newUrl.shortUrl}`);
    }

    console.log('Finished generating and storing dummy entries.');
    res.status(200).send('Successfully generated and stored 1000 entries.');
  } catch (error) {
    console.error('Error generating and storing entries:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Function to generate a random search query
function generateRandomSearchQuery() {
  const searchQueries = ['cat', 'dog', 'technology', 'random', 'openai', 'mongodb', 'javascript', 'programming'];
  const randomIndex = Math.floor(Math.random() * searchQueries.length);
  return `https://www.google.com/search?q=${searchQueries[randomIndex]}`;
}

module.exports = { DummyData };
