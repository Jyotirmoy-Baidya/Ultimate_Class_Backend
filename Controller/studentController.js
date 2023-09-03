const User = require("../Models/user");
const Class = require("../Models/class");
const { ErrorHandler } = require('../utils/errorHandler');

const getStudentMyClasses=async(req,res,next)=>{
    const {studentId}=req.params;
    try {
        const classes=await User.findById(studentId,{classes:1}).populate({path:"classes",select:["name"]})
        res.status(200).json({
            success:true,
            classes
        })
    
    } catch (error) {
        next(new ErrorHandler(error.message,404))
    }
   
}

module.exports={getStudentMyClasses}