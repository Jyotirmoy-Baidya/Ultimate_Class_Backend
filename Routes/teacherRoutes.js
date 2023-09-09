const express = require("express");
const { sendCollabRequest, getSentRequests, getCollabRequests, acceptCollabRequest, rejectCollabRequest, deleteCollabTeachers, GetOwnClasses } = require("../Controller/teacherController");
const router = express.Router();


//Collab Routes
router.post("/sendCollabRqst", sendCollabRequest);
router.get("/getSentCollabRqst", getSentRequests);
router.get("/getCollabRqst", getCollabRequests);
router.post("/acceptCollab", acceptCollabRequest);
router.post("/rejectCollab", rejectCollabRequest);
router.delete("/deleteCollabTeacher", deleteCollabTeachers);
router.get("/ownClasses", GetOwnClasses);

module.exports = router;