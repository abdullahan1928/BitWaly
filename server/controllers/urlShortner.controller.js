
const crypto = require('crypto');
const Url = require('../models/Url.model');
function generateBaseHash(originalUrl) {
    const fullHash = crypto.createHash('md5').update(originalUrl).digest('hex');
    let shortHash = '';
    for (let i = 0; i < 6; i++) {
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
    const shortUrl = generateBaseHash(originalUrl);
    const shardKey = shortUrl[0].toLowerCase();

    let uniqueShortUrl = shortUrl;
    while (await Url.exists({ shardKey, shortUrl: uniqueShortUrl })) {
        uniqueShortUrl = modifyHash(uniqueShortUrl);
    }

    return { shortUrl: uniqueShortUrl, shardKey };
}

const shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;
    try {
        const { shortUrl, shardKey } = await generateUniqueShortUrl(originalUrl);
        const newUrl = new Url({ originalUrl, shortUrl, shardKey });
        await newUrl.save();
        res.send({ shortUrl });
    } catch (error) {
        res.status(500).send("Error processing your request");
    }
};

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
        res.send(url.originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
};

module.exports = { shortenUrl, retrieveUrl };
