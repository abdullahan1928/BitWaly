// Description: Helper functions for URL operations including generating unique short URLs, extracting title and image from a URL, and updating tags for a URL.

const cheerio = require('cheerio');
const fetch = require('node-fetch');
const crypto = require('crypto');
const Url = require('../models/Url.model');
const Tag = require('../models/Tag.model');

// Function to check and update tags for a given URL
async function checkAndUpdateTags(userId, urlId, tags) {
    const existingUrl = await Url.findOne({ user: userId, _id: urlId }); // Finding the existing URL in the database

    if (existingUrl) {
        await updateTagsForUrl(userId, urlId, tags); // If URL exists, update its tags
    } else {
        return res.status(404).send("URL not found");
    }
}

// Function to update tags for a given URL
async function updateTagsForUrl(userId, urlId, tags) {
    const existingTags = await Tag.find({ user: userId }); // Finding existing tags for the user
    const url = await Url.findOne({ user: userId, _id: urlId });

    // Remove tags that are no longer associated with the URL
    for (const existingTag of existingTags) {
        if (!tags.includes(existingTag.name)) {
            // Removing tag association from URL
            existingTag.urls = existingTag.urls.filter((urlId) => urlId.toString() !== url._id.toString());

            // Deleting tag if no URLs associated
            if (existingTag.urls.length === 0) {
                await Tag.findByIdAndDelete(existingTag._id);
            } else {
                await existingTag.save();
            }
        } else {
            // Adding tag to URL if not already associated
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
}

// Function to generate a base hash for a URL
function generateBaseHash(originalUrl) {
    const fullHash = crypto.createHash('md5').update(originalUrl).digest('hex');
    let shortHash = '';
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * fullHash.length);
        shortHash += fullHash[randomIndex];
    }
    return shortHash;
}

// Function to modify hash by replacing a character randomly
function modifyHash(hash) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    const replaceIndex = Math.floor(Math.random() * hash.length);
    return hash.substring(0, replaceIndex) + randomChar + hash.substring(replaceIndex + 1);
}

// Function to generate a unique short URL
async function generateUniqueShortUrl(originalUrl) {
    const startTime = new Date();

    const shortUrl = generateBaseHash(originalUrl);
    const shardKey = shortUrl[0].toLowerCase();

    let uniqueShortUrl = shortUrl;
    let collisions = 0;

    // Loop until a unique short URL is generated
    while (await Url.exists({ shardKey, shortUrl: uniqueShortUrl })) {
        uniqueShortUrl = modifyHash(uniqueShortUrl);
        collisions++;
    }

    const endTime = new Date();
    const totalTime = (endTime - startTime) / 1000;

    return { shortUrl: uniqueShortUrl, shardKey, totalTime, collisions };
}

// Function to remove UTM parameters from a URL
function removeUtmParams(url) {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('utm_source');
    urlObj.searchParams.delete('utm_medium');
    urlObj.searchParams.delete('utm_campaign');
    urlObj.searchParams.delete('utm_term');
    urlObj.searchParams.delete('utm_content');
    return urlObj.toString();
}

// Function to get title and image from a URL
async function getTitleAndImageFromUrl(url, title) {
    const html = await (await fetch(url)).text(); // Fetching HTML content from the URL
    const $ = cheerio.load(html); // Loading HTML content into Cheerio

    // Extracting title from HTML
    let linkTitle = title || $('head title').text() || url.split('/')[2] + '- untitled';

    // Extracting image from HTML
    let image = $('head link[rel="icon"]').attr('href') || $('head link[rel="shortcut icon"]').attr('href') || $('head meta[property="og:image"]').attr('content') || $('head meta[name="twitter:image"]').attr('content') || $('head meta[itemprop="image"]').attr('content') || $('head meta[name="image"]').attr('content') || $('head meta[name="twitter:image:src"]').attr('content') || $('head meta[name="twitter:image"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content') || $('head meta[property="og:image:secure_url"]').attr('content') || $('head meta[property="og:image:url"]').attr('content');

    const domain = url.match(/^https?:\/\/[^/]+/)[0]; // Extracting domain from URL

    const urlWithoutUtm = removeUtmParams(url);

    // Handling relative image URLs
    image = image && image.startsWith('./') ? urlWithoutUtm + image.replace('./', '') : image;

    // Handling image URLs without http/https
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
