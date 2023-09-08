const express = require("express");
const { AddClass, DeleteClass, GetClassData, GetClassTeacherSubjects } = require("../Controller/classController");
const router = express.Router();


router.post("/createNewClass", AddClass);
router.delete("/deleteClass/:id", DeleteClass);

//Working on Single Class
router.get("/singleClass/:id", GetClassData);
router.get("/subjectTeacherPair/:id", GetClassTeacherSubjects);


module.exports = router;