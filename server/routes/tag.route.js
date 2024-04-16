const express = require("express"); 
const router = express.Router(); 

// Importing middleware, controllers, and fetchUser middleware for handling tag-related routes
const { createTag, getAllTags, getTagByUrlId, deleteTag } = require("../controllers/tag.controller");
const fetchUser = require("../middleware/fetchUser");

// Defining routes for managing tags
router.post("/", fetchUser, createTag); // Route to create a tag
router.get("/", fetchUser, getAllTags); // Route to get all tags
router.get("/:urlId", fetchUser, getTagByUrlId); // Route to get a tag by URL ID
router.delete("/:id", fetchUser, deleteTag); // Route to delete a tag

module.exports = router; 
