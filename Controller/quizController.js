const User = require("../Models/user");
const Class = require("../Models/class");
const Quiz = require("../Models/quiz");
const StudentResponse = require("../Models/quizResponse");
const QuizQuestion = require("../Models/quizQuestion");

const { ErrorHandler } = require('../utils/errorHandler');
const quiz = require("../Models/quiz");


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

//Add Question
const addQuestionsToQuiz = async (req, res, next) => {
    try {
        const allQuestions = req.body.allQuestions;
        const QuizId = req.params.quizId;
        let questionsId = [];
        await Promise.all(allQuestions.map(async (ele, i) => {
            const newQuestion = await QuizQuestion.create(
                { ...ele })
            questionsId.push(newQuestion._id);
        }))
        const selectedQuiz = await Quiz.findOneAndUpdate(
            { _id: QuizId },
            {
                $push: {
                    questions: [...questionsId]
                }
            }
        )
        res.status(201).json({
            success: true,
            data: selectedQuiz
        })
    }
    catch (err) {
        return next(new ErrorHandler(err, 404));
    }
}

//Delete Questions From Quiz
const deleteQuestionsFromQuiz = async (req, res, next) => {
    try {
        const questionId = req.body.questionId;
        const quizId = req.params.quizId;
        const deleted = await Quiz.updateOne(
            { '_id': quizId },
            {
                $pull: {
                    'questions': { '$in': [questionId] }
                }
            }
        );
        if (!deleted) {
            return next(new ErrorHandler('No such question found', 500))
        }
        if (deleted.modifiedCount === 0) {
            return next(new ErrorHandler("No Such Question Found", 404))
        }


        //Delete Question from QuizQuestion Collection
        if (deleted) {
            const deleteQuestion = await QuizQuestion.deleteOne({ '_id': questionId });
            res.status(201).json({
                success: true,
                message: "Question Deleted"
            })
        }

    } catch (err) {
        return next(new ErrorHandler(err, 500))
    }
};

//Get Questions From Quiz
const getQuestionsOfQuiz = async (req, res, next) => {
    try {
        const resp = await Quiz.findOne(
            { '_id': req.params.quizId },
            { questions: 1 }
        ).populate(
            { path: 'questions' }
        )
        res.status(201).json({
            success: true,
            data: resp.questions,
            questionCount: resp.questions.length
        })
    }
    catch (err) {
        return next(new ErrorHandler(err, 404));
    }
}


//Update Question
const updateQuestionById = async function updateQuestionById(req, res, next) {
    try {
        const updatedQuestion = await QuizQuestion.findByIdAndUpdate(
            { _id: req.params.questionId },
            {
                $set: {
                    question: req.body.question,
                    type: req.body.type,
                    options: req.body.options,
                    marks: req.body.marks,
                    negativeMarks: req.body.negativeMarks
                }
            });
        res.status(200).json({
            success: true,
            message: "Question Update"
        });
    } catch (e) { console.error(`Error in updating the quiz ${e}`); next(); }
}








module.exports = { createQuiz, addQuestionsToQuiz, deleteQuestionsFromQuiz, getQuestionsOfQuiz, updateQuestionById }

