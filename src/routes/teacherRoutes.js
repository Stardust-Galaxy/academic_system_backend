const express = require('express');
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');
const teacherAuth = require('../middleware/teacherAuth');

const router = express.Router();

router.get('/info', auth, teacherAuth, teacherController.getTeacherInfo);
router.get('/courses', auth, teacherAuth, teacherController.getTeacherCourses);
router.get('/course_students/:courseId/:secId/:semester/:year', auth, teacherAuth, teacherController.getCourseStudents);
router.post('/course_student', auth, teacherAuth, teacherController.addCourseStudent);
router.get('/course_grades/:courseId/:secId/:semester/:year', auth, teacherAuth, teacherController.getCourseGrades);
router.post('/grades', auth, teacherAuth, teacherController.addGrade);
router.put('/grades/:studentId/:courseId/:secId/:semester/:year', auth, teacherAuth, teacherController.updateGrade);

module.exports = router;