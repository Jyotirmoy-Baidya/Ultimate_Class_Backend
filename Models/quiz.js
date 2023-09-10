const mongoose = require("mongoose");

const Quizes = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        classCode: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        // Array of question id 
        questions: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "QuizQuestions"
        },
        noOfQuestionsToDisplay: {
            type: Number,
            // required: "true"
        },
        shuffle: {
            type: Boolean,
            default: false,
            required: true
        }
    }
)


module.exports = mongoose.model("Quizes", Quizes);