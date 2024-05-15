//rotutes for URL management

const express = require("express");
const router = express.Router();

// Importing controllers, fetchUser middleware, and controllers for handling URL-related routes
const fetchUser = require("../middleware/fetchUser");
const { getFormerUrlById } = require("../controllers/formerUrl.controller");

// Defining routes for URL management
router.get("/id/:id", fetchUser, getFormerUrlById); // Route to retrieve a URL by ID

module.exports = router; 
