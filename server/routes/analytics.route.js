const express = require("express");
const router = express.Router();
const { clicksController, deviceAnalyticsController, browserAnalyticsController, botAnalyticsController, osAnalyticsController} = require("../controllers/analytics.controller");
const fetchUser = require("../middleware/fetchUser");


router.get('/clicks/:shortUrl', fetchUser, clicksController);
router.get('/device/:shortUrl', fetchUser, deviceAnalyticsController);
router.get('/browser/:shortUrl', fetchUser, browserAnalyticsController);
router.get('/os/:shortUrl', fetchUser, osAnalyticsController);




module.exports = router;