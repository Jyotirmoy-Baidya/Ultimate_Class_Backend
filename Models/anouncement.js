const mongoose = require("mongoose");

const Anouncement = new mongoose.Schema(
    {

        classId:{
            type:mongoose.Schema.Types.ObjectId
            ,ref:'Class'
        },
        message:{
            type:String,
            required:true
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model("Anouncements", Anouncement);