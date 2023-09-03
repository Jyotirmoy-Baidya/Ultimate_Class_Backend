const express = require("express");
const app = express();
const cookie_parser = require("cookie-parser");
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, "./config.env") })

const teacherRoutes = require("./Routes/teacherRoutes");
const studentRoutes = require("./Routes/studentRoutes");
const userRoutes = require("./Routes/userRoutes");
const classRoutes = require("./Routes/classRoutes");


// const router = require("./routes/route.js")


//db connect
const dbconnect = require("./database/database.js")
dbconnect();

//error middle ware
const { errorMiddleware } = require("./utils/errorHandler.js")
//middle wares

app.use(express.json());
app.use(cookie_parser());

//Routes initial
console.log(process.env.VERSION);
app.use(`${process.env.VERSION}`, userRoutes);

app.use(`${process.env.VERSION}/class`, classRoutes);
// app.use(`${process.env.VERSION}`, classRoutes);
// app.use(`${process.env.VERSION}`, studentRoutes);
app.use(`${process.env.VERSION}/teacher`, teacherRoutes);
app.use(errorMiddleware);






const port = process.env.PORT || 3000;
//listening server
app.listen(port, () => {
    console.log("server is listening at port " + port)
});
