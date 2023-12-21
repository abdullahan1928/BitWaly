const express = require("express");
const router = express.Router();
const { shortenUrl, retrieveUrl } = require("../controllers/urlShortner.controller");
const { DummyData } = require("../controllers/dummyData.controller");

router.post("/shorten", shortenUrl);
router.get("/retreive/:shortUrl", retrieveUrl);
router.post("/dummy", DummyData);

module.exports = router;