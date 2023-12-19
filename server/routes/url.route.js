const express = require("express");
const router = express.Router();
const { shortenUrl, retrieveUrl } = require("../controllers/urlShortner.controller");

router.post("/shorten", shortenUrl);
router.get("/retreive/:shortUrl", retrieveUrl);

module.exports = router;