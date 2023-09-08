const User = require("../Models/user");
const Class = require("../Models/class");
const { ErrorHandler } = require('../utils/errorHandler');

//Adding Class By Admin
//getData: //className//adminEmail
const AddClass = async (req, res, next) => {
    try {
        const TeacherUser = await User.findOne(
            { email: req.body.adminEmail },
            { _id: 1 }
        )
        if (TeacherUser) {
            //Creating a New Class
            const NewClass = await Class.create({
                name: req.body.className,
                admin: req.body.adminEmail,
                subjects: ["Admin"],
                subTeacherPair: [{
                    teacherId: TeacherUser._id,
                    subject: "Admin"
                }]
            });
            if (NewClass) {
                //Sending The New Class Id To Admin
                const OwnClassesUpdate = await User.updateOne(
                    { email: req.body.adminEmail },
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
            else {
                return next(new ErrorHandler("Class Cannot Be Created", 404));
            }
        }
        else {
            return next(new ErrorHandler("User Does Not Exists", 404));
        }
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

//Get Class Data
const GetClassData = async (req, res, next) => {
    try {
        const resp = await Class.findById(
            { _id: req.params.id },
            {
                name: 1,
                admin: 1
            }
        )
        res.status(201).json({
            success: true,
            data: resp
        })
    }
    catch (err) {
        next(new ErrorHandler(err, 404));
    }
};

//Get Class Teachers With Subjects
const GetClassTeacherSubjects = async (req, res, next) => {
    try {
        const resp = await Class.findById(
            { _id: req.params.id },
            { subTeacherPair: 1 }
        );
        if (resp) {
            const data = await Promise.all(resp.subTeacherPair.map(async (ele) => {
                const teacher = await User.findById(ele.teacherId)
                return {
                    teacherId: ele.teacherId,
                    teacherName: teacher.name,
                    subject: ele.subject
                }
            }));

            res.status(201).json({
                success: true,
                data: data
            })
        }
        else {
            return next(new ErrorHandler("Class Not Found", 404));
        }
    }
    catch (err) {
        return (next(new ErrorHandler(err, 404)));
    }
}

//Delete Teacher SubTeacher Pair
const deleteSubTeacherPair = async (req, res, next) => {
    try {
        const updatePair = await Class.updateOne(
            { _id: req.params.id },
            {
                $pull:
                    { subTeacherPair: { teacherId: req.body.teacherId } }
            }
        )

        const updateTeacher = await User.updateOne({ _id: teacherid }, { $pull: { otherclasses: classid } })

        if (updatePair && updateTeacher) {
            res.json({
                success: true,
                message: "subject successfully deleted"
            });
        }
        else {
            next(new ErrorHandler("database error", 404))
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 404))
    }

}









module.exports = { AddClass, DeleteClass, GetClassData, GetClassTeacherSubjects };