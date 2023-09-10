const mongoose = require("mongoose");

const Classes = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        admin: {
            type: String,
            required: true,
        },
        classCode: {
            type: String,
            required: true,
            default: function () {
                return Math.floor(Math.random() * 9000000000) + 1000000000;
            },
            unique: true,
        },
        students: {
            type: [{ type: mongoose.Schema.Types.ObjectId }],
            ref: "Users"
        },
        subjects: {
            type: [{ type: String }],
        },
        subTeacherPair: {
            type: [{
                type: {
                    teacherId: {
                        type: String,
                    },
                    subject: {
                        type: String
                    }
                }
            }]
        },
        endEmail: {
            type: String,
        },
        anouncements:{
            type:[{type:mongoose.Schema.Types.ObjectId }],
            ref:"Anouncements"
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model("Classes", Classes);