const mongoose = require("mongoose");

const Responses = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quizes"
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        responses: {
            type: [{
                questionId: { type: mongoose.Schema.Types.ObjectId },
                selectedOptions: [{ type: String }]
            }],
        },
        score:
    }
)