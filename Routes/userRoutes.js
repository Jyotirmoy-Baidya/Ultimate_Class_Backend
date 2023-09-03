const express = require("express");
const router = express.Router();
const {createUser}=require("../Controller/userController")


router.post("/createUser",createUser);

module.exports=router