const express = require("express");
const router = express.Router();
const {getStudentMyClasses}=require("../Controller/studentController")
router.get("/getStudentMyClasses/:studentId",getStudentMyClasses)

module.exports = router;