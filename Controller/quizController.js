const User = require("../Models/user");
const Class = require("../Models/class");
const Quiz = require("../Models/quiz");
const StudentResponse = require("../Models/quizResponse");
const QuizQuestion = require("../Models/quizQuestion");

const { ErrorHandler } = require('../utils/errorHandler');

//Create Quiz
const createQuiz = async (req, res, next) => {
    try {
        const findClass = await Class.findOne(
            { classCode: req.body.classCode },
            { _id: 1 }
        )
        if (findClass) {
            const newQuiz = await Quiz.create(req.body);
            res.status(200).json({
                success: true,
                message: "quiz created"
            })
        }
        else {
            return (new ErrorHandler("Invalid Class Code", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 404))
    }
}

module.exports = { createQuiz }

