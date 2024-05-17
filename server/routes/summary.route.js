//routes for account's summary

const express = require("express"); 
const router = express.Router();

// Importing middleware, controllers, and fetchUser middleware for handling user-related summary routes
const { totalClicks, deviceClicks, referrerClicks, allLocations, topLocations, clicksWithDates } = require("../controllers/summary.controller");
const fetchUser = require("../middleware/fetchUser");

// Defining routes for summarizing user-related data
router.get('/clicks', fetchUser, totalClicks); // Route to get total clicks
router.get('/devices', fetchUser, deviceClicks); // Route to get device clicks
router.get('/referrers', fetchUser, referrerClicks); // Route to get referrer clicks
router.get('/locations', fetchUser, allLocations); // Route to get all locations
router.get('/topLocations', fetchUser, topLocations); // Route to get top locations
router.get('/clickswithdates', fetchUser, clicksWithDates); // Route to get clicks with dates

module.exports = router; 
