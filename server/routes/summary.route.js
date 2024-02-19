const express = require("express");
const router = express.Router();
const { totalClicks, deviceClicks, referrerClicks, allLocations, topLocations, clicksWithDates } = require("../controllers/summary.controller");
const fetchUser = require("../middleware/fetchUser");


router.get('/clicks', fetchUser, totalClicks);
router.get('/devices', fetchUser, deviceClicks);
router.get('/referrers', fetchUser, referrerClicks);
router.get('/locations', fetchUser, allLocations);
router.get('/topLocations', fetchUser, topLocations);
router.get('/clickswithdates', fetchUser, clicksWithDates);


module.exports = router;