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
    const numEntries = 1000;
    console.log(`Generating and storing ${numEntries} dummy entries...`);

    for (let i = 0; i < numEntries; i++) {
      const randomSearchQuery = generateRandomSearchQuery();
      const { shortUrl, shardKey } = await generateUniqueShortUrl(randomSearchQuery);

      const newUrl = new Url({ originalUrl: randomSearchQuery, shortUrl, shardKey });
      await newUrl.save();

      console.log(`Entry ${i + 1}/${numEntries} saved: ${newUrl.shortUrl}, original URL: ${newUrl.originalUrl}`);
    }

    console.log('Finished generating and storing dummy entries.');
    res.status(200).send('Successfully generated and stored 1000 entries.');
  } catch (error) {
    console.error('Error generating and storing entries:', error);
    res.status(500).send('Internal Server Error');
  }
}

function generateSyllable() {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const vowels = 'aeiou';
  return consonants[Math.floor(Math.random() * consonants.length)] +
         vowels[Math.floor(Math.random() * vowels.length)];
}

function generateWord(syllableCount) {
  let word = '';
  for (let i = 0; i < syllableCount; i++) {
    word += generateSyllable();
  }
  return word;
}

function generateWordList(wordCount, minSyllables, maxSyllables) {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    const syllableCount = Math.floor(Math.random() * (maxSyllables - minSyllables + 1)) + minSyllables;
    words.push(generateWord(syllableCount));
  }
  return words;
}




// Function to generate a random search query
function generateRandomSearchQuery() {
  const searchQueries = generateWordList(10000, 3, 5); // Generate 10,000 words, each with 3 to 5 syllables
  const randomIndex = Math.floor(Math.random() * searchQueries.length);
  return `https://www.google.com/search?q=${searchQueries[randomIndex]}`;
}

module.exports = { DummyData };
