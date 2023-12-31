const express = require("express");
const router = express.Router();
const { shortenUrl, retrieveUrl, retrieveUrlsForUser, deleteUrl } = require("../controllers/urlShortner.controller");
const { DummyData } = require("../controllers/dummyData.controller");
const fetchUser = require("../middleware/fetchUser");

router.post("/shorten", fetchUser, shortenUrl);
router.get("/retreive/:shortUrl", retrieveUrl);
router.post("/dummy", DummyData);
router.get("/userUrls", fetchUser, retrieveUrlsForUser);
router.delete("/delete/:urlId", fetchUser, deleteUrl);

module.exports = router;