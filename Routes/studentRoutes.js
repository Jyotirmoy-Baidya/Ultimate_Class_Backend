const express = require("express");
const router = express.Router();
const { getStudentMyClasses, studentJoinClass } = require("../Controller/studentController");


router.get("/getStudentMyClasses", getStudentMyClasses)
router.post("/studentJoinClass/:classCode", studentJoinClass)

module.exports = router;