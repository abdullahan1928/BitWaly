const mongoose = require('mongoose');
const crypto = require('crypto');
const Url = require('../models/Url.model');

// Function to generate a base hash for the short URL
function generateBaseHash(originalUrl) {
  const fullHash = crypto.createHash('md5').update(originalUrl).digest('hex');
  let shortHash = '';
  for (let i = 0; i < 7; i++) {
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
    const numEntries = 100000;
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
  const searchQueries = ['cat', 'dog', 'technology', 'random', 'openai', 'mongodb', 'javascript', 'programming', 'coding', 'web development', 'software engineering', 'computer science', 'machine learning', 'artificial intelligence', 'deep learning', 'neural networks', 'data science', 'data structures', 'algorithms', 'leetcode', 'hackerrank', 'leetcode', 'github', 'gitlab', 'stackoverflow', 'google', 'youtube', 'facebook', 'twitter', 'instagram', 'linkedin', 'reddit', 'tiktok', 'pinterest', 'netflix', 'amazon', 'apple', 'microsoft', 'tesla', 'nvidia', 'amd', 'intel', 'qualcomm', 'ibm', 'oracle', 'adobe', 'spotify', 'airbnb', 'uber', 'lyft', 'doordash', 'grubhub', 'postmates', 'instacart', 'zoom', 'slack', 'discord', 'twitch', 'tinder', 'bumble', 'hinge', 'okcupid', 'match', 'badoo', 'hulu', 'disney+', 'hbo', 'starz', 'showtime', 'cbs', 'nbc', 'abc', 'fox', 'cnn', 'msnbc', 'fox news', 'bbc', 'npr', 'pbs', 'espn', 'nba', 'nfl', 'mlb', 'nhl', 'nascar', 'formula 1', 'soccer', 'football', 'basketball', 'baseball', 'hockey', 'tennis', 'golf', 'olympics', 'tokyo olympics', '2020 olympics', '2021 olympics', '2022 olympics', '2024 olympics', '2028 olympics', '2032 olympics', '2040 olympics', '2044 olympics', '2048 olympics', '2052 olympics', '2056 olympics', '2060 olympics', '2064 olympics', '2068 olympics', '2072 olympics', '2076 olympics', '2080 olympics', '2084 olympics', '2088 olympics', '2092 olympics', '2096 olympics', '2100 olympics'];
  const randomIndex = Math.floor(Math.random() * searchQueries.length);
  return `https://www.google.com/search?q=${searchQueries[randomIndex]}`;
}

module.exports = { DummyData };
