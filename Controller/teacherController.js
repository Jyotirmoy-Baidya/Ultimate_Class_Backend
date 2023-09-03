const User = require("../Models/user");
const Class = require("../Models/class");
const { ErrorHandler } = require('../utils/errorHandler');


//COLLAB FUNCTIONALITY
//Sent Collab Request
const sendCollabRequest = async (req, res, next) => {
    try {
        //If Trying To Collab With Yourself 
        if (req.body.email === req.body.instEmail) {
            next(new ErrorHandler('You Cannot Collab With Yourself', 403));
        }
        //Get Institute Data
        const instResp = await User.findOne(
            { email: req.body.instEmail },
            {
                name: 1,
                email: 1,
                collabRqsts: 1,
                collabTeachers: 1,
            }
        )
        //Get Teacher Data
        const resp = await User.findOne(
            { email: req.body.email },
            {
                email: 1,
                institutes: 1,
                collabSendRqsts: 1
            }
        )
        if (instResp) {
            //Check If Already Request Is Sent
            if (instResp.collabRqsts.includes(resp._id)) {
                next(new ErrorHandler("Already Request Sent", 404));
            }
            //Check You Are Already Collabed
            if (instResp.collabTeachers.includes(resp._id)) {
                next(new ErrorHandler(`You Have Already Collabed`, 404));
            }
            //Add teacher id to collab request
            const addToCollabRqst = await User.updateOne(
                { email: req.body.instEmail },
                {
                    $push: {
                        collabRqsts: [resp._id]
                    }
                }
            )
            //Add Institute id to Teacher's send collab rqst
            const addToSendqst = await User.updateOne(
                { email: req.body.email },
                {
                    $push: {
                        collabSendRqsts: [instResp._id]
                    }
                }
            )

            res.status(201).json({
                success: true,
                message: `Request Sent To ${instResp.name}`
            })
        }
        else {
            next(new ErrorHandler({ message: "Institute Does Not Exists" }, 404));
        }
    }
    catch (err) {
        next(new ErrorHandler(err, 404));
    }
}

//Get and Show Sent Collab Request
const getSentRequests = async (req, res, next) => {
    try {
        const resp = await User.findOne(
            { email: req.body.email },
            {
                collabSendRqsts: 1
            }
        ).populate(
            {
                path: "collabSendRqsts",
                select: ["name", "email"]
            }
        )
        res.status(201).json(
            {
                success: true,
                data: resp.collabSendRqsts
            }
        )
    }
    catch (err) {
        next(new ErrorHandler(err, 500));
    }
};


//Get And Show Collab Request
const getCollabRequests = async (req, res, next) => {
    try {
        const resp = await User.findOne(
            { email: req.body.email },
            {
                collabRqsts: 1
            }
        ).populate(
            {
                path: "collabRqsts",
                select: ["name", "email"]
            }
        )
        res.status(201).json(
            {
                success: true,
                data: resp.collabRqsts
            }
        )
    }
    catch (err) {
        next(new ErrorHandler(err, 500));
    }
}

//Accept Collab Request
const acceptCollabRequest = async (req, res, next) => {
    try {
        const resp = await User.findOne(
            {
                email: req.body.email
            },
            {
                collabRqsts: 1
            }
        )

        //Institute Update
        if (resp.collabRqsts.includes(req.body.id)) {
            const respInst = await User.findOneAndUpdate(
                {
                    email: req.body.email
                },
                {
                    $push: {
                        collabTeachers: req.body.id
                    },
                    $pull: {
                        collabRqsts: req.body.id
                    }
                }
            )

            //Teacher Update
            const respTeacher = await User.findOneAndUpdate(
                {
                    _id: req.body.id
                },
                {
                    $push: {
                        institutes: respInst._id
                    },
                    $pull: {
                        collabSendRqsts: respInst._id
                    }
                }
            )

            res.status(201).json({
                success: true,
                message: `You Have Accepted ${respTeacher.name}`
            })

        }
        else {
            console
            next(new ErrorHandler("No Such User Have Sent A Request", 404))
        }

    }
    catch (err) {
        next(new ErrorHandler(err), 404);
    }
}

//Reject Collab Request
const rejectCollabRequest = async (req, res, next) => {
    try {
        const resp = await User.findOne(
            {
                email: req.body.email
            },
            {
                collabRqsts: 1
            }
        )

        if (resp.collabRqsts.includes(req.body.id)) {
            const respInst = await User.findOneAndUpdate(
                {
                    email: req.body.email
                },
                {
                    $pull: {
                        collabRqsts: req.body.id
                    }
                }
            )

            const respTeacher = await User.findOneAndUpdate(
                {
                    _id: req.body.id
                },
                {
                    $pull: {
                        collabSendRqsts: respInst._id
                    }
                }
            )

            res.status(201).json({
                success: true,
                message: `You Have Rejected ${respTeacher.name}`
            })

        }
        else {
            console
            next(new ErrorHandler("No Such User Have Sent A Request", 404))
        }

    }
    catch (err) {
        next(new ErrorHandler(err), 404);
    }
}


//Delete Collab Teacher
const deleteCollabTeachers = async (req, res, next) => {
    try {
        const check = await User.findOne(
            { email: req.body.email },
            { collabTeachers: 1 }
        )
        if (check.collabTeachers.includes(req.body.id)) {
            const respInst = await User.findOneAndUpdate(
                { email: req.body.email },
                {
                    $pull: {
                        collabTeachers: req.body.id
                    }
                }
            )
            const respTeacher = await User.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $pull: {
                        institutes: respInst._id
                    }
                }
            )
            res.status(202).json({
                success: true,
                message: `You Have Removed ${respTeacher.name}`,
            })
        }
        else {
            next(new ErrorHandler("You Are Not Collabed With The User"));
        }
    }
    catch (err) {
        next(new ErrorHandler(err, 500));
    }
}



module.exports = { sendCollabRequest, getSentRequests, getCollabRequests, acceptCollabRequest, rejectCollabRequest, deleteCollabTeachers };