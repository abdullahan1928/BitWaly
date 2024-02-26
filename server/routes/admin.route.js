const express = require("express");
const router = express.Router();
const fetchAdmin = require("../middleware/fetchAdmin");
const { fetchUsers, deleteUser } = require("../controllers/admin.controller");

router.get('/users', fetchAdmin, fetchUsers);
router.delete('/users/delete/:id', fetchAdmin, deleteUser);

module.exports = router;