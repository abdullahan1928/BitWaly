const express = require("express");
const router = express.Router();
const { shortenUrl, retrieveUrl, retrieveUrlsForUser, deleteUrl, getUrlById, updateUrl } = require("../controllers/url.controller");
const { DummyData } = require("../controllers/dummyData.controller");
const fetchUser = require("../middleware/fetchUser");

router.post("/retreive/:shortUrl", retrieveUrl);
router.get("/retreive/id/:id", fetchUser, getUrlById);
router.get("/userUrls", fetchUser, retrieveUrlsForUser);
router.post("/shorten", fetchUser, shortenUrl);
router.post("/dummy", DummyData);
router.put("/update/:id", fetchUser, updateUrl);
router.delete("/delete/:id", fetchUser, deleteUrl);

module.exports = router;