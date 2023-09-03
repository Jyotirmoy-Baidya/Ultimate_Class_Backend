const express = require("express");
const { sendCollabRequest, getSentRequests, getCollabRequests, acceptCollabRequest, rejectCollabRequest, deleteCollabTeachers } = require("../Controller/teacherController");
const router = express.Router();

router.post("/sendCollabRqst", sendCollabRequest);
router.get("/getSentCollabRqst", getSentRequests);
router.get("/getCollabRqst", getCollabRequests);
router.post("/acceptCollab", acceptCollabRequest);
router.post("/rejectCollab", rejectCollabRequest);
router.delete("/deleteCollabTeacher", deleteCollabTeachers)

module.exports = router;