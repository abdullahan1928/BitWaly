// Desc: Controller for generating and storing dummy data in the database. not in use when app is live.

const crypto = require('crypto');
const Url = require('../models/Url.model');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { faker } = require('@faker-js/faker');

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
    const numEntriesPerUser = 100;
    console.log(`Generating and storing ${numEntriesPerUser} dummy entries for each user...`);

    // Fetch all users from the database
    const users = await User.find({}, '_id name');
    if (users.length === 0) {
      throw new Error('No users found in the database.');
    }

    const searchDomains = ['google.com', 'youtube.com'];
    const getRandomDomain = () => searchDomains[Math.floor(Math.random() * searchDomains.length)];

    for (let userIndex = 0; userIndex < users.length; userIndex++) {
      const user = users[userIndex];
      const userId = user._id;
      const userName = user.name;

      for (let i = 0; i < numEntriesPerUser; i++) {
        const words = faker.lorem.words().replace(/\s+/g, '-').toLowerCase();
        const domain = getRandomDomain();

        let randomSearchQuery;

        if (domain === 'google.com') {
          randomSearchQuery = `https://${domain}/search?q=${words}`;
        } else if (domain === 'youtube.com') {
          randomSearchQuery = `https://${domain}/results?search_query=${words}`;
        }

        const { shortUrl, shardKey } = await generateUniqueShortUrl(randomSearchQuery);

        let iconUrl;

        if (domain === 'google.com') {
          iconUrl = 'https://seeklogo.com/images/N/new-google-favicon-logo-5E38E037AF-seeklogo.com.png'; // Google favicon URL
        } else if (domain === 'youtube.com') {
          iconUrl = 'https://cdn-icons-png.flaticon.com/256/1384/1384060.png'; // YouTube favicon URL
        }

        const newUrl = new Url({
          originalUrl: randomSearchQuery,
          shortUrl,
          shardKey,
          user: userId,
          meta: { image: iconUrl },
        });

        await newUrl.save();

        console.log(`Entry ${i + 1}/${numEntriesPerUser} saved for User ${userName} (${userId}) - User ${userIndex + 1}/${users.length}: ${newUrl.shortUrl}, original URL: ${newUrl.originalUrl}`);
      }
    }

    console.log('Finished generating and storing dummy entries.');
    res.status(200).send(`Successfully generated and stored ${numEntriesPerUser * users.length} entries.`);
  } catch (error) {
    console.error('Error generating and storing entries:', error);
    res.status(500).send('Internal Server Error');
  }
};




const dummyAccounts = async (req, res) => {
  try {
    const numEntries = 1000;
    console.log(`Generating and storing ${numEntries} dummy entries...`);

    for (let i = 0; i < numEntries; i++) {
      const name = faker.internet.userName();
      const email = faker.internet.email();
      const password = 'w@lee';

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user',
      });
      console.log(`Entry ${i + 1}/${numEntries} saved: ${email}`);
    }

    console.log('Finished generating and storing dummy data.');
    res.status(200).send(`Successfully generated and stored ${numEntries} entries.`);
  } catch (error) {
    console.error('Error generating and storing entries:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { DummyData, dummyAccounts };
