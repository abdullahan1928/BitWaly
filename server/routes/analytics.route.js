// analytics routes. all routes will pass through fetchUser middleware to check if the user is authenticated or not.
// all the analytics routes will be protected by this middleware
const express = require("express");
const router = express.Router();

// Importing middleware and controllers for handling user-related analytics
const { allAnalyticsController, clicksController, browserAnalyticsController, osAnalyticsController, deviceAnalyticsController, mobileAnalyticsController, locationAnalyticsController, referrerAnalyticsController, accessCountController, weeklyCountController, weeklyChangeController } = require("../controllers/analytics.controller");
const fetchUser = require("../middleware/fetchUser");

// Defining routes for various user analytics
router.get('/clicks/:id', fetchUser, clicksController); // Route to get clicks for a user
router.get('/browser/:id', fetchUser, browserAnalyticsController); // Route to get browser analytics for a user
router.get('/os/:id', fetchUser, osAnalyticsController); // Route to get OS analytics for a user
router.get('/device/:id', fetchUser, deviceAnalyticsController); // Route to get device analytics for a user
router.get('/mobile/:id', fetchUser, mobileAnalyticsController); // Route to get mobile analytics for a user
router.get('/location/:id', fetchUser, locationAnalyticsController); // Route to get location analytics for a user
router.get('/referrer/:id', fetchUser, referrerAnalyticsController); // Route to get referrer analytics for a user
router.get("/accesscount/:id", accessCountController); // Route to get access count for a user
router.get("/weeklycount/:id", weeklyCountController); // Route to get weekly count for a user
router.get("/weeklychange/:id", weeklyChangeController); // Route to get weekly change for a user

router.get('/all/:id', fetchUser, allAnalyticsController); // Route to get all analytics for a user

module.exports = router; 
