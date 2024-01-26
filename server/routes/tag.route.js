const express = require("express");
const router = express.Router();
const {
    createTag,
    getAllTags,
    getTagByUrlId,
    deleteTag
} = require("../controllers/tag.controller");
const fetchUser = require("../middleware/fetchUser");

router.post("/", fetchUser, createTag);
router.get("/", fetchUser, getAllTags);
router.get("/:urlId", fetchUser, getTagByUrlId);
router.delete("/:id", fetchUser, deleteTag);

module.exports = router;