const User = require("../Models/user");
const Class = require("../Models/class");
const { ErrorHandler } = require('../utils/errorHandler');

const getStudentMyClasses=async(req,res,next)=>{
    const {studentEmail}=req.body;
    try {
        const classes=await User.findOne({email:studentEmail},{classes:1}).populate({path:"classes",select:["name"]})
        res.status(200).json({
            success:true,
            classes
        })
    
    } catch (error) {
        next(new ErrorHandler(error.message,404))
    }
   
}

const studentJoinClass=async(req,res,next)=>{
    const {classCode}=req.params;
    const {studentEmail}=req.body;

    try {
        
    
    const getClass=await Class.findOne({classCode},{_id:1});
    if(!getClass){
      return  next(new ErrorHandler("can't get the class",404));
    }

    console.log(getClass);


    const getStudent=await User.findOne({email:studentEmail},{_id:1,classes:1})
    if(!getStudent){
      return  next(new ErrorHandler("can't get the student",404));
    }
    console.log(getStudent);

   if( getStudent.classes.includes(getClass._id)){
    return next(new ErrorHandler("you have already joined this class",404));
   }


    const addClassToStudent=User.updateOne({email:studentEmail},{
        $push:{
            classes:[getClass._id]
        }
    })
    const addStudentToClass=Class.updateOne({classCode},{
        $push:{
            students:[getStudent._id],
        }
    })
    await Promise.all([addClassToStudent,addStudentToClass]);
    res.status(200).json({
        success:true,
        message:"student joined successfully"
    })
} catch (error) {
    next(new ErrorHandler(error.message,404)); 
}
}

module.exports={getStudentMyClasses,studentJoinClass}