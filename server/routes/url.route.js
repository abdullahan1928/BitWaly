const express = require("express");
const router = express.Router();
const { shortenUrl, retrieveUrl } = require("../controllers/urlShortner.controller");

router.post("/urlshortner", shortenUrl);
router.get("/urlretrievel/:shortUrl", retrieveUrl);

module.exports = router;