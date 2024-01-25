const express = require("express");
const router = express.Router();
const { allAnalyticsController, clicksController } = require("../controllers/analytics.controller");
const fetchUser = require("../middleware/fetchUser");


router.get('/clicks/:shortUrl', fetchUser, clicksController);
// router.get('/browser/:id', fetchUser, browserAnalyticsController);
// router.get('/os/:id', fetchUser, osAnalyticsController);
// router.get('/device/:id', fetchUser, deviceAnalyticsController);

router.get('/all/:shortUrl', fetchUser, allAnalyticsController);

module.exports = router;