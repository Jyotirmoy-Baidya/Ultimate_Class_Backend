const express = require("express");
const router = express.Router();
const  {
    createAnouncement,
    getAllAnouncement,
    deleteAnouncement,
    updateAnouncement
}=require("../Controller/anouncmentController")

router.post("/createAnouncement/:classId",createAnouncement);
router.get("/getAllAnouncement/:classId",getAllAnouncement);
router.delete("/deleteAnouncement/:classId",deleteAnouncement);
router.put("/updateAnouncement/:classId",updateAnouncement);
module.exports=router;