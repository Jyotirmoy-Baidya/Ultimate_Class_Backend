const express = require("express");
const { AddClass, DeleteClass, GetOwnClasses } = require("../Controller/classController");
const router = express.Router();


router.post("/createNewClass", AddClass);
router.delete("/deleteClass/:id", DeleteClass);
router.get("/ownClasses", GetOwnClasses);

module.exports = router;