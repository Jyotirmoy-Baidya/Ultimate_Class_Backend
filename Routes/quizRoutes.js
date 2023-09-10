const express = require("express");
const router = express.Router();
const { createQuiz, addQuestionsToQuiz, deleteQuestionsFromQuiz, getQuestionsOfQuiz, updateQuestionById, getQuizQuestionById,
    deleteQuiz,
    createAndGetStudentResponse,
    editStudentResponse,submitStudentResponse } = require("../Controller/quizController");



router.post("/createQuiz", createQuiz);

//Quiz Routes For Teacher
router.put("/addQuestions/:quizId", addQuestionsToQuiz);
router.delete("/deleteQuestion/:quizId", deleteQuestionsFromQuiz);
router.get("/getQuizQuestions/:quizId", getQuestionsOfQuiz);
router.put("/quizQuestionUpdate/:questionId", updateQuestionById)


router.delete("/deleteQuiz/:quizId", deleteQuiz);
router.post("/createAndGetStudentResponse/:quizId", createAndGetStudentResponse);
router.put("/editStudentResponse/:quizId", editStudentResponse);
router.post("/submitStudentResponse/:quizId", submitStudentResponse);


module.exports = router