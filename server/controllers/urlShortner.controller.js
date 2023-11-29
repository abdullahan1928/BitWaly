

const Url = require('../models/Url.model');
const crypto = require('crypto');
const validator = require('validator');


const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;
  

    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
  
    try {
      // Check if the original URL is already shortened
      const existingUrl = await Url.findOne({ originalUrl });
  
      if (existingUrl) {
        return res.status(200).json(existingUrl);
      }
  
      let randomURL = generateRandomString(5);
  
      // Ensure the generated short URL is unique
      while (await Url.findOne({ shortUrl: randomURL })) {
        randomURL = generateRandomString(5);
      }
  
      const newUrl = new Url({ originalUrl, shortUrl: randomURL });
      
      await newUrl.save();
  
      res.status(201).json(newUrl);
    } catch (error) {
      console.error('Error shortening URL:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const retrieveUrl = async (req, res) => {
  const { shortUrl } = req.params;
  console.log(shortUrl);

  try {
    const url = await Url.findOne({ shortUrl });

    if (url) {
      res.send(url.originalUrl);
    } else {
      res.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    console.error('Error redirecting to original URL:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { shortenUrl, retrieveUrl };
