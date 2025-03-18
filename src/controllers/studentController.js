// src/controllers/studentController.js
const db = require('../config/db');

exports.getStudentInfo = async (req, res, next) => {
    try {
        const studentId = req.userData.id; // From auth middleware

        const [students] = await db.query(
            'SELECT student_name, student_id, major, dept_name, year, tot_cred, tele FROM students WHERE user_id = ? ',
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({
            success: true,
            student_name: students[0].student_name,
            student_id: students[0].student_id,
            major: students[0].major,
            dept_name: students[0].dept_name,
            year: students[0].year,
            tele: students[0].tele,
        });
    } catch (error) {
        next(error);
    }
};


// Add this to src/controllers/studentController.js
exports.getStudentSchedule = async (req, res, next) => {
    try {
        const studentId = req.userData.id; // From auth middleware
        // First get student_id from students table using user_id
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = students[0].student_id;

        // Get schedule data - joining tables to get complete information
        const [results] = await db.query(`CALL getStudentScheduleByStudentId(?)`, [student_id]);
        const schedules = results[0];
        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        next(error);
    }
};

exports.getEnrolledCourses = async (req, res, next) => {
    try {
        const studentId = req.userData.id; // From auth middleware
        // First get student_id from students table using user_id
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [studentId]
        );
        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = students[0].student_id;

        // Get enrolled courses
        const [results] = await db.query(`CALL getEnrolledCoursesByStudentId(?)`, [student_id]);

        const courses = results[0];

        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

exports.getAvailableCourses = async (req, res, next) => {
    try {
        const studentId = req.userData.id;

        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = students[0].student_id;

        // Call the stored procedure instead of using inline SQL
        const [results] = await db.query('CALL getAvailableCoursesByStudentId(?)', [student_id]);

        // The results from a stored procedure come in the first element of the results array
        const courses = results[0];

        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        next(error);
    }
}

exports.enrollCourse = async (req, res, next) => {
    try {
        const userId = req.userData.id;
        const { course_id, sec_id, semester, year } = req.body;

        // Get student_id from students table
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = students[0].student_id;

        // Call the stored procedure
        await db.query('CALL enrollCourse(?, ?, ?, ?, ?)',
            [student_id, course_id, sec_id, semester, year]
        );

        res.status(201).json({
            success: true,
            message: 'Course enrolled successfully'
        });
    } catch (error) {
        // Handle specific errors thrown by the stored procedure
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                message: error.sqlMessage
            });
        }
        next(error);
    }
};

exports.dropCourse = async (req, res, next) => {
    try {
        const studentId = req.userData.id; // From auth middleware
        const { course_id, sec_id, semester, year } = req.body;
        // First get student_id from students table using user_id
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = students[0].student_id;

        // Drop course
        await db.query('CALL dropCourse(?, ?, ?, ?, ?)',
            [student_id, course_id, sec_id, semester, year]
        );

        res.status(201).json({
            success: true,
            message: 'Course dropped successfully'
        })

    } catch (error) {
        // Handle specific errors thrown by the stored procedure
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                message: error.sqlMessage
            });
        }
        next(error);
    }
}

exports.getGrades = async (req, res, next) => {
    try {
        const studentId = req.userData.id; // From auth middleware
        // First get student_id from students table using user_id
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = students[0].student_id;

        // Get grades
        const [results] = await db.query(`CALL getStudentGradesByStudentId(?)`, [student_id]);
        const grades = results[0];
        res.json({
            success: true,
            data: grades
        });
    } catch (error) {
        next(error);
    }
};