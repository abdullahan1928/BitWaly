const express = require("express");
const router = express.Router();
const fetchAdmin = require("../middleware/fetchAdmin");
const { fetchUsers } = require("../controllers/admin.controller");

router.get('/users', fetchAdmin, fetchUsers);

module.exports = router;