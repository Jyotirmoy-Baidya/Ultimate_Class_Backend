const express = require("express");
const { AddClass, DeleteClass, addSubjects, addSubTeacherPair, deleteSubTeacherPair } = require("../Controller/classController");

const router = express.Router();


router.post("/createNewClass", AddClass);
router.delete("/deleteClass/:id", DeleteClass);

router.post("/addSubjects/:classId", addSubjects);
router.post("/addSubTeacherPair/:classId", addSubTeacherPair);
router.delete("/deleteSubTeacherPair/:classId", deleteSubTeacherPair);

module.exports = router;