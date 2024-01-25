const express = require("express");
const router = express.Router();
const { allAnalyticsController, clicksController, browserAnalyticsController, osAnalyticsController, deviceAnalyticsController, mobileAnalyticsController, locationAnalyticsController } = require("../controllers/analytics.controller");
const fetchUser = require("../middleware/fetchUser");


router.get('/clicks/:id', fetchUser, clicksController);
router.get('/browser/:id', fetchUser, browserAnalyticsController);
router.get('/os/:id', fetchUser, osAnalyticsController);
router.get('/device/:id', fetchUser, deviceAnalyticsController);
router.get('/mobile/:id', fetchUser, mobileAnalyticsController);
router.get('/location/:id', fetchUser, locationAnalyticsController);

router.get('/all/:id', fetchUser, allAnalyticsController);

module.exports = router;