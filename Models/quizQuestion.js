const mongoose = require("mongoose");

const quizQuestions = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["multi", "single"]
        },
        options: {
            type: [String],
            required: true
        },
        correctAnswers: {
            type: [String],
            required: true
        },
        marks: {
            type: Number,
            required: true
        },
        negativeMarks: {
            type: Number,
            default: 0
        },


    }
)


module.exports = mongoose.model("QuizQuestions", quizQuestions);