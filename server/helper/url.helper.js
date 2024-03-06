const cheerio = require('cheerio');
const fetch = require('node-fetch');
const crypto = require('crypto');
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');

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

function removeUtmParams(url) {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('utm_source');
    urlObj.searchParams.delete('utm_medium');
    urlObj.searchParams.delete('utm_campaign');
    urlObj.searchParams.delete('utm_term');
    urlObj.searchParams.delete('utm_content');
    return urlObj.toString();
}

async function getTitleAndImageFromUrl(url, title) {
    const html = await (await fetch(url)).text();
    const $ = cheerio.load(html);

    let linkTitle = title || $('head title').text() || originalUrl.split('/')[2] + '- untitled';

    let image = $('head link[rel="icon"]').attr('href') || $('head link[rel="shortcut icon"]').attr('href') || $('head meta[property="og:image"]').attr('content') || $('head meta[name="twitter:image"]').attr('content') || $('head meta[itemprop="image"]').attr('content') || $('head meta[name="image"]').attr('content') || $('head meta[name="twitter:image:src"]').attr('content') || $('head meta[name="twitter:image"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content');

    const domain = url.match(/^https?:\/\/[^/]+/)[0];

    const urlWithoutUtm = removeUtmParams(url);

    image = image && image.startsWith('./') ? urlWithoutUtm + image.replace('./', '') : image;

    if (image !== undefined && !image.startsWith('http') && !image.startsWith('https')) {
        image = domain + '/' + image || url + '/' + image;
    }

    return { linkTitle, image };
}

module.exports = {
    generateUniqueShortUrl,
    getTitleAndImageFromUrl,
    checkAndUpdateTags,
};