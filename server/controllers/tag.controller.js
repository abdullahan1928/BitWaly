const Tag = require("../models/Tag.model");

const getAllTags = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;

        const tags = await Tag.find({ user: userId });

        // const tagNames = tags.map((tag) => { return tag.name });

        if (tags.length > 0) {
            return res.status(200).send(tags);
        } else {
            return res.status(404).send("No tags found for the user");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

const getTagByUrlId = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;
        const { urlId } = req.params;

        const tags = await Tag.find({
            user: userId,
            urls: { $in: [urlId] },
        });

        if (tags.length > 0) {
            // const tagNames = tags.map((tag) => {
            //     return tag.name;
            // });

            return res.status(200).send(tags);
        } else {
            return res.status(404).send("Tag not found");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

const createTag = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;

        const { url, tag } = req.body;

        const newTag = new Tag({
            user: userId,
            urls: [url],
            name: tag,
        });

        const savedTag = await newTag.save();

        if (savedTag) {
            return res.status(200).send(savedTag);
        } else {
            return res.status(500).send("Error processing your request");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

const deleteTag = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;
        const { id } = req.params;

        const deletedTag = await Tag.findByIdAndDelete({ user: userId, _id: id });

        if (deletedTag) {
            return res.status(200).send("Tag deleted successfully");
        } else {
            return res.status(404).send("Tag not found");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

module.exports = {
    getAllTags,
    getTagByUrlId,
    createTag,
    deleteTag,
};