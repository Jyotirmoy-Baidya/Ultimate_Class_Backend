const express = require("express");
const router = express.Router();
const {  createQuiz,
    deleteQuiz,
    createAndGetStudentResponse,
    editStudentResponse } = require("../Controller/quizController");



router.post("/createQuiz", createQuiz);
router.delete("/deleteQuiz", deleteQuiz);
router.post("/createAndGetStudentResponse/:quizId", createAndGetStudentResponse);
router.put("/editStudentResponse", editStudentResponse);


module.exports = router