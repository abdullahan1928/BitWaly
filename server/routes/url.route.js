const express = require("express");
const router = express.Router();
const { urlShortnerController } = require("../controllers/urlShortner.controller");

router.post("/urlshortner", urlShortnerController);


module.exports = router;