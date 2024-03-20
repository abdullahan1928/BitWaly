const express = require("express");
const router = express.Router();
const fetchAdmin = require("../middleware/fetchAdmin");
const { fetchUsers, deleteUser, totalClicks, deviceClicks, referrerClicks, allLocations, topLocations, clicksWithDates } = require("../controllers/admin.controller");

router.get('/users', fetchAdmin, fetchUsers);
router.delete('/users/delete/:id', fetchAdmin, deleteUser);

router.get('/clicks/:userId', fetchAdmin, totalClicks);
router.get('/devices/:userId', fetchAdmin, deviceClicks);
router.get('/referrers/:userId', fetchAdmin, referrerClicks);
router.get('/locations/:userId', fetchAdmin, allLocations);
router.get('/topLocations/:userId', fetchAdmin, topLocations);
router.get('/clickswithdates/:userId', fetchAdmin, clicksWithDates);

module.exports = router;