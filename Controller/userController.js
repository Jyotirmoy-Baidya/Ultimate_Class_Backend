const User = require("../Models/user")
const { ErrorHandler } = require('../utils/errorHandler')

//Create An User
const createUser = async (req, res, next) => {
    try {
        const findUser = await User.findOne({ email: req.body.email });
        //For Login
        if (findUser) {
            res.status(200).json({
                success: true,
            })
        }
        //For Register
        else {
            const user = await User.create(req.body)
            res.status(200).json({
                success: true,
                data: user
            })
        }
    }
    catch (err) {
        next(new ErrorHandler(err.message, 404))
    }
}



module.exports = { createUser }