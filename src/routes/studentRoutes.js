// Update src/routes/studentRoutes.js
const express = require('express');
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/info', auth, studentController.getStudentInfo);
router.get('/schedule', auth, studentController.getStudentSchedule); // Add this line

module.exports = router;