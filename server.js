const express = require("express");
const app = express();
const cookie_parser = require("cookie-parser");
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, "./config.env") })

const userRoute = require("./Routes/teacherRoutes");


// const router = require("./routes/route.js")


//db connect
const dbconnect = require("./database/database.js")
dbconnect();

//error middle ware
// const { errorMiddleware } = require("./utils/error.js")
//middle wares
app.use(express.json());
app.use(cookie_parser());

//Routes initial
app.use(`${process.env.VERSION}`, userRoute);
// app.use(errorMiddleware);




const port = process.env.PORT || 3000;
//listening server
app.listen(port, () => {
    console.log("server is listening at port " + port)
});
