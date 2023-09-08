const mongoose = require("mongoose");

const quizQuestions = new mongoose.Schema(
    {
        Question:{
            type:String,
            required:true
        },
        Type:{
            type:String,
            required:true,
            enum:["multi","single"]
        },
        Options:{
            type:[String],
            required:true
        },
        CorrectAnswers:{
            type:[String],
            required:true
        },
        Marks:{
            type:Number,
            required:true
        },
        NegativeMarks:{
            type:Number,
        },


    }
)


module.exports=mongoose.model("QuizQuestions",quizQuestions);