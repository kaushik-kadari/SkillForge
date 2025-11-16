const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getSubtopics);
router.get('/hello', (req, res) => res.send('Hello World!'));
router.post('/add-subtopic', userController.addSubtopic);
router.get('/get-subtopic/:subject/:subtopic', userController.getSubtopicBySubjectAndName);
router.post('/add-feedback', userController.addFeedback);
router.get('/get-video-link/:subject/:topic', userController.getVideoLink);
router.post('/add-video-link', userController.addVideoLink);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/validateJWT', userController.validateJWT);
router.get('/get-badges/:email', userController.getBadges);
router.post('/add-badges', userController.addBadges);
router.get('/get-tasks/:email', userController.getTasks);
router.post('/add-task', userController.addTask);
router.post('/update-password', userController.updatePassword);
router.post('/update-user', userController.updateUser);
router.post('/reset-password', userController.resetPassword);
router.post('/set-password', userController.setPassword);
router.post('/addNotes', userController.addNotes);
router.get('/getNotes/:email/:subject', userController.getNotes);

//interview
router.post("/start-interview", userController.startInterview);
router.post("/answer",userController.answerInterview);
router.post("/end-interview",userController.endInterview);
router.get("/interview",userController.interview);
router.post("/save-interview",userController.saveInterview);
router.post("/update-interview",userController.updateInterview);
router.delete("/delete-interview",userController.deleteInterview);




module.exports = router;
