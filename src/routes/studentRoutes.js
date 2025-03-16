// Update src/routes/studentRoutes.js
const express = require('express');
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/info', auth, studentController.getStudentInfo);
router.get('/schedule', auth, studentController.getStudentSchedule); // Add this line
router.get('/enrolled-courses', auth, studentController.getEnrolledCourses);
router.get('/available-courses', auth, studentController.getAvailableCourses);
router.post('/enroll', auth, studentController.enrollCourse);
router.post('/drop', auth, studentController.dropCourse);
router.get('/grades',auth,studentController.getGrades);
module.exports = router;