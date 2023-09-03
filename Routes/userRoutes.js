const express = require("express");
const router = express.Router();
const {createUser}=require("../Controller/userController")
console.log("userRoute");
router.post("/createUser",createUser);
module.exports=router