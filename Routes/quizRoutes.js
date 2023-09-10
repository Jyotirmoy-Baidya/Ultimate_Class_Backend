const express = require("express");
const router = express.Router();
const { createQuiz, addQuestionsToQuiz, deleteQuestionsFromQuiz, getQuestionsOfQuiz, updateQuestionById, getQuizQuestionById } = require("../Controller/quizController");



router.post("/createQuiz", createQuiz);

//Quiz Routes For Teacher
router.put("/addQuestions/:quizId", addQuestionsToQuiz);
router.delete("/deleteQuestion/:quizId", deleteQuestionsFromQuiz);
router.get("/getQuizQuestions/:quizId", getQuestionsOfQuiz);
router.put("/quizQuestionUpdate/:questionId", updateQuestionById)




module.exports = router