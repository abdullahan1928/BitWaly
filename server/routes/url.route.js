const express = require("express"); 
const router = express.Router(); 

// Importing controllers, fetchUser middleware, and controllers for handling URL-related routes
const { shortenUrl, retrieveUrl, retrieveUrlsForUser, deleteUrl, getUrlById, updateUrl } = require("../controllers/url.controller");
const { DummyData } = require("../controllers/dummyData.controller");
const fetchUser = require("../middleware/fetchUser");

// Defining routes for URL management
router.post("/retreive/:shortUrl", retrieveUrl); // Route to retrieve a URL by short URL
router.get("/retreive/id/:id", fetchUser, getUrlById); // Route to retrieve a URL by ID
router.get("/userUrls", fetchUser, retrieveUrlsForUser); // Route to retrieve all URLs for a user
router.post("/shorten", fetchUser, shortenUrl); // Route to shorten a URL
router.post("/dummy", DummyData); // Route to fetch dummy data
router.put("/update/:id", fetchUser, updateUrl); // Route to update a URL
router.delete("/delete/:id", fetchUser, deleteUrl); // Route to delete a URL

module.exports = router; 
