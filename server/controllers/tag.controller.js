//controller that manages the tags associated with a link

const Tag = require("../models/Tag.model");

// Controller to get all tags for the user
const getAllTags = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;

        // Find tags belonging to the user
        const tags = await Tag.find({ user: userId });

        // Check if tags exist
        if (tags.length > 0) {
            return res.status(200).send(tags);
        } else {
            return res.status(404).send("No tags found for the user");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

// Controller to get tags associated with a URL
const getTagByUrlId = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;
        const { urlId } = req.params;

        // Find tags associated with the URL and user
        const tags = await Tag.find({
            user: userId,
            urls: { $in: [urlId] },
        });

        // Check if tags exist for the URL
        if (tags.length > 0) {
            return res.status(200).send(tags);
        } else {
            return res.status(404).send("Tag not found");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

// Controller to create a new tag
const createTag = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;

        const { url, tag } = req.body;

        // Create a new tag
        const newTag = new Tag({
            user: userId,
            urls: [url],
            name: tag,
        });

        // Save the new tag
        const savedTag = await newTag.save();

        // Check if tag is saved successfully
        if (savedTag) {
            return res.status(200).send(savedTag);
        } else {
            return res.status(500).send("Error processing your request");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

// Controller to delete a tag
const deleteTag = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;
        const { id } = req.params;

        // Find and delete the tag
        const deletedTag = await Tag.findByIdAndDelete({ user: userId, _id: id });

        // Check if tag is deleted successfully
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
