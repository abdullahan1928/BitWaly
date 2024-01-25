const express = require("express");
const router = express.Router();
const { allAnalyticsController, clicksController, browserAnalyticsController, osAnalyticsController, deviceAnalyticsController, mobileAnalyticsController, locationAnalyticsController } = require("../controllers/analytics.controller");
const fetchUser = require("../middleware/fetchUser");


router.get('/clicks/:shortUrl', fetchUser, clicksController);
router.get('/browser/:shortUrl', fetchUser, browserAnalyticsController);
router.get('/os/:shortUrl', fetchUser, osAnalyticsController);
router.get('/device/:shortUrl', fetchUser, deviceAnalyticsController);
router.get('/mobile/:shortUrl', fetchUser, mobileAnalyticsController);
router.get('/location/:shortUrl', fetchUser, locationAnalyticsController);

router.get('/all/:shortUrl', fetchUser, allAnalyticsController);

module.exports = router;