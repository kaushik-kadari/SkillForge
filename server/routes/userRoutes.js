const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getSubtopics);
// router.get('/', (req, res) => res.send('Hello World!'));
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

module.exports = router;
