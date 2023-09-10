const Anouncement =require( "../Models/anouncement");
const User = require("../Models/user");
const Class = require("../Models/class");
const { ErrorHandler } = require('../utils/errorHandler');
//create Anouncement
const createAnouncement = async (req, res, next) => {
    try {
        const {classId}=req.params
        const findQuiz=await Class.findById(classId)
        if(!findQuiz){
             return next(new ErrorHandler("class not found", 404));
        }
        const NewAnouncement = await Anouncement.create({
            classId:classId,
            message: req.body.message
        });
        if (NewAnouncement) {
         const anouncementAdded=  await Class.findOneAndUpdate({
                _id: classId
            },{
                $push:{
                    anouncements:NewAnouncement._id
                }
            })
            if(anouncementAdded){
            res.status(200).json({
                success: true,
                message: "Anouncement Created"
            });
            }else{
                return next(new ErrorHandler("Anouncement Cannot Be Added", 404));
            }
        }
        else {
            return next(new ErrorHandler("Anouncement Cannot Be Created", 404));
        }
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404));
    }
}

//get all anouncement
const getAllAnouncement = async (req, res, next) => {
    try {
        const {classId}=req.params
        const findQuiz=await Class.findById(classId)
        if(!findQuiz){
             return next(new ErrorHandler("class not found", 404));
        }
        const allAnouncement = await Anouncement.find({classId});
        if (allAnouncement) {
            res.status(200).json({
                success: true,
                message: "All Anouncement",
                data: allAnouncement
            });
        }
        else {
            return next(new ErrorHandler("Anouncement Cannot Be Found", 404));
        }
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404));
    }
}

//delete anouncement
const deleteAnouncement = async (req, res, next) => {
    try {
        const {classId}=req.params
        const {anouncementId}=req.body
        const findQuiz=await Class.findById(classId)
        if(!findQuiz){
             return next(new ErrorHandler("class not found", 404));
        }
        const findAnouncement=await Anouncement.findById(anouncementId)
        if(!findAnouncement){
             return next(new ErrorHandler("Anouncement not found", 404));
        }
        const deleteAnouncement = await Anouncement.findByIdAndDelete(anouncementId);
        const anouncementAdded=  await Class.findOneAndUpdate({
            _id: classId
        },
        {
            $pull:{
                anouncements:anouncementId
            }
        })

        if(!anouncementAdded){
            return next(new ErrorHandler("Anouncement Cannot Be Deleted", 404));
        }
        if (deleteAnouncement) {
            res.status(200).json({
                success: true,
                message: "Anouncement Deleted"
            });
        }
        else {
            return next(new ErrorHandler("Anouncement Cannot Be Deleted", 404));
        }
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404));
    }
}

//update anouncement 
const updateAnouncement = async (req, res, next) => {
    try {
        const {classId}=req.params
        const {anouncementId}=req.body
        const findQuiz=await Class.findById(classId)
        if(!findQuiz){
             return next(new ErrorHandler("class not found", 404));
        }
        const findAnouncement=await Anouncement.findById(anouncementId)
        if(!findAnouncement){
             return next(new ErrorHandler("Anouncement not found", 404));
        }
        const updateAnouncement = await Anouncement.findByIdAndUpdate(anouncementId, {
            message: req.body.message
        });
        if (updateAnouncement) {
            res.status(200).json({
                success: true,
                message: "Anouncement Updated"
            });
        }
        else {
            return next(new ErrorHandler("Anouncement Cannot Be Updated", 404));
        }
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404));
    }
}

//module exports
module.exports = {
    createAnouncement,
    getAllAnouncement,
    deleteAnouncement,
    updateAnouncement
}
