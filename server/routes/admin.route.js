const express = require("express");
const router = express.Router();
const fetchAdmin = require("../middleware/fetchAdmin");
const { fetchUsers, deleteUser } = require("../controllers/admin.controller");
const { totalClicks, deviceClicks, referrerClicks, allLocations, topLocations, clicksWithDates } = require("../controllers/summary.controller");

router.get('/users', fetchAdmin, fetchUsers);
router.delete('/users/delete/:id', fetchAdmin, deleteUser);

router.get('/clicks', fetchAdmin, totalClicks);
router.get('/devices', fetchAdmin, deviceClicks);
router.get('/referrers', fetchAdmin, referrerClicks);
router.get('/locations', fetchAdmin, allLocations);
router.get('/topLocations', fetchAdmin, topLocations);
router.get('/clickswithdates', fetchAdmin, clicksWithDates);

module.exports = router;