// src/routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

//Admin info routes
router.get('/info', auth, adminAuth, adminController.getAdminInfo);
router.get('/teachers', auth, adminAuth, adminController.getTeachers);
// Course management routes
router.get('/courses', auth, adminAuth, adminController.getAllCourses);
router.get('/courses/:id', auth, adminAuth, adminController.getCourseById);
router.post('/courses', auth, adminAuth, adminController.addCourse);
router.put('/courses/:id', auth, adminAuth, adminController.updateCourse);
router.delete('/courses/:id', auth, adminAuth, adminController.deleteCourse);

// Section management routes
router.get('/sections', auth, adminAuth, adminController.getAllSections);
router.get('/sections/:id', auth, adminAuth, adminController.getSectionById);
router.post('/sections', auth, adminAuth, adminController.addSection);
router.put('/sections/:course_id/:sec_id/:semester/:year/:capacity', auth, adminAuth, adminController.updateSection);
router.delete('/sections/:courseId/:secId/:year/:semester', auth, adminAuth, adminController.deleteSection);

// Grade management routes
router.get('/grades', auth, adminAuth, adminController.getAllGrades);
router.get('/grades/student/:studentId', auth, adminAuth, adminController.getGradesByStudent);
router.post('/grades', auth, adminAuth, adminController.addGrade);
router.put('/grades/:id', auth, adminAuth, adminController.updateGrade);
router.delete('/grades/:student_id/:course_id/:sec_id/:semester/:year', auth, adminAuth, adminController.deleteGrade);

//Student management routes
router.get('/students', auth, adminAuth, adminController.getAllStudents);

// User registration routes
router.post('/register/student', auth, adminAuth, adminController.registerStudent);
router.post('/register/teacher', auth, adminAuth, adminController.registerTeacher);

//Department management routes
router.get('/departments', auth, adminAuth, adminController.getAllDepartments);
module.exports = router;

//User management routes
router.get('/users/max-id', auth, adminAuth, adminController.getUserMaxId);

//classroom management routes
router.get('/classrooms', auth, adminAuth, adminController.getAllClassrooms);

//time-slot management routes
router.get('/time-slots', auth, adminAuth, adminController.getAllTimeSlots);