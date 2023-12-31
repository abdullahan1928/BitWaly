const express = require("express");
const router = express.Router();
const { shortenUrl, retrieveUrl } = require("../controllers/urlShortner.controller");
const { DummyData } = require("../controllers/dummyData.controller");
const fetchUser = require("../middleware/fetchUser");

router.post("/shorten", fetchUser, shortenUrl);
router.get("/retreive/:shortUrl", retrieveUrl);
router.post("/dummy", DummyData);

module.exports = router;