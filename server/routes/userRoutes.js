const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const codeExecutionController = require('../controllers/codeExecutionController');
const aiController = require('../controllers/aiController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/', userController.getSubtopics);
router.get('/hello', (req, res) => res.send('Hello World!'));
router.post('/add-subtopic', requireAuth, userController.addSubtopic);
router.get('/get-subtopic/:subject/:subtopic', requireAuth, userController.getSubtopicBySubjectAndName);
router.post('/add-feedback', requireAuth, userController.addFeedback);
router.get('/get-video-link/:subject/:topic', requireAuth, userController.getVideoLink);
router.post('/add-video-link', requireAuth, userController.addVideoLink);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/validateJWT', userController.validateJWT);
router.get('/get-badges/:email', requireAuth, userController.getBadges);
router.post('/add-badges', requireAuth, userController.addBadges);
router.get('/get-tasks/:email', requireAuth, userController.getTasks);
router.post('/add-task', requireAuth, userController.addTask);
router.post('/update-password', requireAuth, userController.updatePassword);
router.post('/update-user', requireAuth, userController.updateUser);
router.post('/reset-password', userController.resetPassword);
router.post('/set-password', userController.setPassword);
router.post('/addNotes', requireAuth, userController.addNotes);
router.get('/getNotes/:email/:subject', requireAuth, userController.getNotes);

// AI / YouTube — keys stay on the server
router.post('/ai/generate-content', requireAuth, aiController.generateContent);
router.post('/ai/chat', requireAuth, aiController.chatTutor);
router.post('/ai/generate-quiz', requireAuth, aiController.generateQuiz);
router.post('/ai/submit-quiz', requireAuth, aiController.submitQuiz);
router.post('/resolve-video', requireAuth, aiController.resolveVideoLink);

//interview
router.post("/start-interview", requireAuth, userController.startInterview);
router.post("/answer", requireAuth, userController.answerInterview);
router.post("/end-interview", requireAuth, userController.endInterview);
router.get("/interview", requireAuth, userController.interview);
router.post("/save-interview", requireAuth, userController.saveInterview);
router.post("/update-interview", requireAuth, userController.updateInterview);
router.delete("/delete-interview", requireAuth, userController.deleteInterview);
router.post("/transcribe", requireAuth, userController.transcribeAudio);

// CodePlay — Judge0 CE (RapidAPI)
router.post("/execute-code", requireAuth, codeExecutionController.executeCode);
router.get("/execute-languages", requireAuth, codeExecutionController.getSupportedLanguages);




module.exports = router;
