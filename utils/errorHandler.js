class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "internal server error"
    err.statusCode = err.statusCode || 500
    console.log("errerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    res.status(err.statusCode).json({
        success: false,
        message: err
    })
}

module.exports = { errorMiddleware, ErrorHandler }