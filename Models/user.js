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
            type: [{ type: mongoose.Schema.type.ObjectId }],
            ref: "Class"
        },
        otherClasses: {
            type: [{ type: mongoose.Schema.type.ObjectId }],
            ref: "Class"
        },
        collabRqst: {
            type: [{ type: mongoose.Schema.type.ObjectId }],
            ref: "Users"
        },
        collabTeachers: {
            type: [{ type: mongoose.Schema.type.ObjectId }],
            ref: "Users"
        },

        //Student Specific Fields
        classes: {
            type: [{ type: mongoose.Schema.type.ObjectId }],
            ref: "Class"
        }
    }
)

module.exports = mongoose.model("Users", User);