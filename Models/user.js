const mongoose = require("mongoose");

const User = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ["teacher", "student"],
        },

        //Teacher Specific Fields
        ownClasses: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Class"
        },
        otherClasses: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Class"
        },
        collabRqsts: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Users"
        },
        collabTeachers: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Users"
        },
        institutes:{
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Users"
        },
        collabSendRqst: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Users"
        },

        //Student Specific Fields
        classes: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Class"
        }
    }
)

module.exports = mongoose.model("Users", User);