const express = require("express");
const router = express.Router();
const { createQuiz } = require("../Controller/quizController");



router.post("/createQuiz", createQuiz);


module.exports = router