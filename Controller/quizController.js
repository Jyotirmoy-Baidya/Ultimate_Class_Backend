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

//delete Quiz
const deleteQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const findQuiz = await Quiz.findById(quizId, { questions: 1 });
        //delete all Questions 
        const deleteQuestions = await QuizQuestion.deleteMany({ _id: { $in: findQuiz.questions } });
        if (!deleteQuestions) {
            return next(new ErrorHandler("Quiz Not Found", 404));
        }
        //delete all student response using quizId
        const deleteStudentResponses = await StudentResponse.deleteMany({ quizId })
        if (!deleteStudentResponses) {
            return next(new ErrorHandler("Quiz Not Found", 404));
        }

        //delete the actual quiz
        const resp = await Quiz.findOneAndDelete(
            {
                _id: quizId,

            }
        )
        if (resp) {
            res.status(200).json({
                success: true,
                message: "Quiz Deleted"
            })
        }
        else {
            return next(new ErrorHandler("Quiz Not Found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 404))
    }
}

//create student response
const createAndGetStudentResponse = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const findQuiz = await Quiz.findById(quizId, { questions: 1 });
        if (findQuiz) {
            //ctreation of response
            //if response allready have
            let findResponse = await StudentResponse.findOne({ quizId, studentId: req.body.studentId });
            if (!findResponse) {
                const responses = findQuiz.questions.map((question) => {
                    return {
                        questionId: question,
                        studentAnswer: []
                    }
                })
                findResponse = await StudentResponse.create({ quizId: quizId, studentId: req.body.studentId, response: responses });
            }
            // getting the responses
            const response = await StudentResponse.findOne(
                { quizId: quizId, studentId: req.body.studentId },
                { response: 1 }
            ).populate(
                {
                    path: "response.questionId",
                    select: ["question", "options", "marks", "type", "nagativeMarks"]
                }
            )




            res.status(200).json({
                success: true,
                data: response.response
            })

        }
        else {
            return next(new ErrorHandler("Quiz Not Found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 404))
    }
}
//edit student response
const editStudentResponse = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const findQuiz = await Quiz.findById(quizId, { questions: 1 });
        if (findQuiz) {
            const editResponse = await StudentResponse.findOneAndUpdate(
                { quizId, studentId: req.body.studentId },
                {
                    $set: {
                        response: req.body.response
                    }
                }
            )
            if (editResponse) {
                res.status(200).json({
                    success: true,
                    message: "Response Edited"
                })
            }
            else {
                return next(new ErrorHandler("Response Not Found", 404));
            }
        }
        else {
            return next(new ErrorHandler("Quiz Not Found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 404))
    }
}

//submit student response
const submitStudentResponse = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const findQuiz = await Quiz.findById(quizId, { questions: 1 });
        if (findQuiz) {
            findResponse=await StudentResponse.findOne({quizId,studentId:req.body.studentId}).populate({path:"response.questionId"})
            if(findResponse){
                let score=0;
                findResponse.response.forEach((response)=>{
                    
                    response.questionId.correctAnswers.forEach((answer)=>{
                        let correct=true;
                        if(!response.studentAnswer.includes(answer)){
                            correct=false;
                        }

                        if(correct){
                            score+=(response.questionId.marks/response.questionId.correctAnswers.lenth);
                        }
                        else{
                            score-=(response.questionId.nagativeMarks/response.questionId.correctAnswers.lenth);
                        }
                    })
                  
                }
                )
                const submitResponse=await StudentResponse.findOneAndUpdate(
                    { quizId, studentId: req.body.studentId },
                    {
                        $set: {
                            score:score
                        }
                    }
                )
                if(submitResponse){
                    res.status(200).json({
                        success: true,
                        message: "Response Submitted"
                    })
                }
                else{
                    return next(new ErrorHandler("Response Not Submitted", 404));
                }
            }
            else{
                return next(new ErrorHandler("Response Not Found", 404));
            }
        }
        else {
            return next(new ErrorHandler("Quiz Not Found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 404))
    }
}











module.exports = {
    createQuiz, addQuestionsToQuiz, deleteQuestionsFromQuiz, getQuestionsOfQuiz, updateQuestionById, deleteQuiz,
    createAndGetStudentResponse,
    editStudentResponse,submitStudentResponse
}

