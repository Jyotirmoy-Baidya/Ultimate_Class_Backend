const mongoose = require("mongoose");

//Connecting With Atlas
const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
    }).then(() => {
        console.log("DB connected")
    }).catch((e) => {
        console.log("db not connected for ", e)
    })

}
module.exports = dbConnect;