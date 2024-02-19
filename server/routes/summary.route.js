const express = require("express");
const router = express.Router();
const { totalClicks, deviceClicks, referrerClicks, allLocations } = require("../controllers/summary.controller");
const fetchUser = require("../middleware/fetchUser");


router.get('/clicks', fetchUser, totalClicks);
router.get('/devices', fetchUser, deviceClicks);
router.get('/referrers', fetchUser, referrerClicks);
router.get('/locations', fetchUser, allLocations);


module.exports = router;