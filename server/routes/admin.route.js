// admin routes. all routes will pass through fetchAdmin middleware to check if the user is an admin or not

const express = require("express");
const router = express.Router();

// Importing middleware and controllers for handling admin-related routes
const fetchAdmin = require("../middleware/fetchAdmin");
const { fetchUsers, deleteUser, totalClicks, deviceClicks, referrerClicks, allLocations, topLocations, clicksWithDates } = require("../controllers/admin.controller");

// Defining routes for admin functionalities
router.get('/users', fetchAdmin, fetchUsers); // Route to fetch users
router.delete('/users/delete/:id', fetchAdmin, deleteUser); // Route to delete a user

// Routes for various analytics related to admin functionalities
router.get('/clicks/:userId', fetchAdmin, totalClicks); // Route to get total clicks for a user
router.get('/devices/:userId', fetchAdmin, deviceClicks); // Route to get device clicks for a user
router.get('/referrers/:userId', fetchAdmin, referrerClicks); // Route to get referrer clicks for a user
router.get('/locations/:userId', fetchAdmin, allLocations); // Route to get all locations for a user
router.get('/topLocations/:userId', fetchAdmin, topLocations); // Route to get top locations for a user
router.get('/clickswithdates/:userId', fetchAdmin, clicksWithDates); // Route to get clicks with dates for a user

module.exports = router; 
