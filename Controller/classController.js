const User = require("../Models/user");
const Class = require("../Models/class");
const { ErrorHandler } = require('../utils/errorHandler');

//Adding Class By Admin
const AddClass = async (req, res, next) => {
    try {
        //Creating a New Class
        const NewClass = await Class.create({
            name: req.body.name,
            admin: req.body.email,
            subjects: ["Admin"],
            subTeacherPair: [{
                teacherId: req.body.email,
                subject: "Admin"
            }]
        });
        //Sending The New Class Id To Admin
        const OwnClassesUpdate = await User.updateOne(
            { email: req.body.email },
            {
                $push: {
                    ownClasses: [NewClass._id]
                }
            }
        )
        res.status(200).json({
            success: true,
            message: "New Class Created"
        });
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404));
    }
}

//Delete Class By Admin
const DeleteClass = async (req, res, next) => {
    const { id } = req.params;
    try {
        const resp = await Class.findOneAndDelete(
            {
                _id: id,
                admin: req.body.email
            }
        );
        if (!resp) {
            res.status(404).json({
                success: false,
                message: "Class Does Not Exist"
            });
        }
        res.status(200).json({
            success: true,
            message: "Class Deleted"
        });
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404));
    }
}

//Get My Own Classes
const GetOwnClasses = async (req, res, next) => {
    try {
        const resp = await User.findOne(
            {
                email: req.body.email,
            },
            {
                ownClasses: 1
            }
        ).populate({ path: "ownClasses", select: ["name", "admin"] })
        res.status(200).json({
            success: true,
            data: resp
        })
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404));
    }
}

module.exports = { AddClass, DeleteClass, GetOwnClasses };