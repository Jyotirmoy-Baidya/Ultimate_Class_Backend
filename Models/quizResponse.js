const mongoose = require("mongoose");

const quizResponse = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quizes"
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        response: {
            type: [{
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "QuizQuestions"
                },
                studentAnswer: {
                    type: [String]
                    //                    required : true
                }
            }]
        },
        score: {
            type: Number,
            default: 0
        },
        createAt: {
            type: Date,
            default: Date.now
        }


    }
)


module.exports = mongoose.model("QuizResponse", quizResponse);
