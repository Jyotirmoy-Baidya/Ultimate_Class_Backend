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


const addSubjects = async (req, res, next) => {
    const { subjectName, adminEmail } = req.body;
    const { classId } = req.params;

    try {
        const getClass = await Class.findById(classId, { _id: 1, admin: 1, subjects: 1 });
        if (!getClass) {
            return next(new ErrorHandler("class not found", 404));
        }


        const getAdmin = await User.findOne({ email: adminEmail }, { _id: 1 })
        if (!getAdmin || !getAdmin._id) {
            return next(new ErrorHandler("Invalid Admin", 404));
        }


        //user auth[institute]
        if (adminEmail != getClass.admin) {
            return next(new ErrorHandler('unauthorized', 404));
        }


        //check already exists
        if (getClass.subjects.includes(subjectName)) {
            return next(new ErrorHandler('subject already exist', 404))
        }

        const addSubjectToClass = await Class.updateOne({ _id: classId }, {
            $push: { subjects: [subjectName] }
        })

        res.status(200).json({
            success: true,
            message: "subject added successfully"
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 404));
    }
}

const addSubTeacherPair = async (req, res, next) => {
    const { classId } = req.params
    const { teacherId, subjectName } = req.body;
    try {
        //getting the teacher
        const teacher = await User.findById(teacherId, { _id: 1, otherClasses: 1 })
        if (!teacher) {
            return next(new ErrorHandler("invalid teacher id ", 500))
        }

        //getting the class
        const getClass = await Class.findById(classId, { subjects: 1, subTeacherPair: 1 })


        if (!getClass) {
            return next(new ErrorHandler('class not found ', 404));
        }

        // check subject is present or not in class subjects array
        const findSubject = await Class.findOne({ _id: classId, subjects: { $in: [subjectName] } });

        if (!(findSubject)) { return next(new ErrorHandler('no such subject ', 403)); }



        //check subTeacherPair exist
        const newSubTeacherPair = {
            teacherId: teacherId,
            subject: subjectName
        }


        //sub schema check
        const isSubTeacherPairExist = await Class.findOne({ _id: classId, subTeacherPair: { $elemMatch: newSubTeacherPair } });

        if (isSubTeacherPairExist) {
            return next(new ErrorHandler('pair already exist ', 403));
        }

        //add pair
        const addSubTeacherPair = await Class.findOneAndUpdate({ _id: classId }, { $push: { subTeacherPair: [newSubTeacherPair] } });

        //check other class
        const checkOtherClass = await User.findOne({ _id: teacherId, otherClasses: { $in: [classId] } })
        if (!checkOtherClass) {
            await User.findOneAndUpdate({ _id: teacherId }, { $push: { otherClasses: [classId] } })
        }
        res.status(200).json({
            success: true,
            message: "successfully added subTeacherPair"
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 403))
    }
}



const deleteSubTeacherPair = async (req, res, next) => {
    const { classId } = req.params
    const { teacherId, subjectName } = req.body;
    try {
        //getting the teacher
        const teacher = await User.findById(teacherId, { _id: 1, otherClasses: 1 })
        if (!teacher) {
            return next(new ErrorHandler("invalid teacher id ", 500))
        }

        //getting the class
        const getClass = await Class.findById(classId, { subjects: 1, subTeacherPair: 1 })


        if (!getClass) {
            return next(new ErrorHandler('class not found ', 404));
        }

        // check subject is present or not in class subjects array
        const findSubject = await Class.findOne({ _id: classId, subjects: { $in: [subjectName] } });

        if (!(findSubject)) { return next(new ErrorHandler('no such subject ', 403)); }



        //check subTeacherPair exist
        const newSubTeacherPair = {
            teacherId: teacherId,
            subject: subjectName
        }


        //sub schema check
        let isSubTeacherPairExist = await Class.findOne({ _id: classId, subTeacherPair: { $elemMatch: newSubTeacherPair } });

        if (isSubTeacherPairExist) {
            //pull pair
            const addSubTeacherPair = await Class.findOneAndUpdate({ _id: classId }, { $pull: { subTeacherPair: newSubTeacherPair } });
        } else {
            return next(new ErrorHandler('pair does not already exist ', 403));
        }



        //check  pairs exists or not with same id 
        isSubTeacherPairExist = await Class.findOne({ _id: classId, subTeacherPair: { $elemMatch: { teacherId: teacherId } } });

        if (!isSubTeacherPairExist) {
            await User.findOneAndUpdate({ _id: teacherId }, { $pull: { otherClasses: classId } })
        }
        res.status(200).json({
            success: true,
            message: "successfully pulled subTeacherPair"
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 403))
    }
}
module.exports = { AddClass, DeleteClass, addSubjects, addSubTeacherPair, deleteSubTeacherPair };