const express = require("express");
const router = express.Router();
const { createQuiz, addQuestionsToQuiz, deleteQuestionsFromQuiz, getQuestionsOfQuiz, updateQuestionById, getQuizQuestionById,
    deleteQuiz,
    createAndGetStudentResponse,
    editStudentResponse } = require("../Controller/quizController");



router.post("/createQuiz", createQuiz);

//Quiz Routes For Teacher
router.put("/addQuestions/:quizId", addQuestionsToQuiz);
router.delete("/deleteQuestion/:quizId", deleteQuestionsFromQuiz);
router.get("/getQuizQuestions/:quizId", getQuestionsOfQuiz);
router.put("/quizQuestionUpdate/:questionId", updateQuestionById)


router.delete("/deleteQuiz", deleteQuiz);
router.post("/createAndGetStudentResponse/:quizId", createAndGetStudentResponse);
router.put("/editStudentResponse", editStudentResponse);


module.exports = router