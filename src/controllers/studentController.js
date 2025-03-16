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
        const [schedules] = await db.query(`
            SELECT c.course_id, c.course_name, c.dept_name, c.credits, 
                   s.sec_id, s.semester, s.year, s.building, s.room_number,
                   ts.day, ts.start_time, ts.end_time,
                   tchs.teacher_id, tchs.teacher_name
            FROM takes t
            JOIN sections s ON t.course_id = s.course_id 
                AND t.sec_id = s.sec_id 
                AND t.semester = s.semester 
                AND t.year = s.year
            JOIN courses c ON t.course_id = c.course_id
            LEFT JOIN time_slots ts ON s.time_slot_id = ts.time_slot_id
            LEFT JOIN teaches tch ON s.course_id = tch.course_id
                AND s.sec_id = tch.sec_id
                AND s.semester = s.semester
                AND s.year = s.year
            LEFT JOIN teachers tchs ON tch.teacher_id = tchs.teacher_id
            WHERE t.student_id = ?
            ORDER BY ts.day, ts.start_time
        `, [student_id]);
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
        const [courses] = await db.query(`
            SELECT c.course_id, c.course_name, c.dept_name, c.credits, 
                   s.sec_id, s.semester, s.year, s.building, s.room_number,
                   ts.day, ts.start_time, ts.end_time,
                   tchs.teacher_id, tchs.teacher_name
            FROM takes t
            JOIN sections s ON t.course_id = s.course_id 
                AND t.sec_id = s.sec_id 
                AND t.semester = s.semester 
                AND t.year = s.year
            JOIN courses c ON t.course_id = c.course_id
            LEFT JOIN time_slots ts ON s.time_slot_id = ts.time_slot_id
            LEFT JOIN teaches tch ON s.course_id = tch.course_id
                AND s.sec_id = tch.sec_id
                AND s.semester = s.semester
                AND s.year = tch.year
            LEFT JOIN teachers tchs ON tch.teacher_id = tchs.teacher_id
            WHERE t.student_id = ?
            ORDER BY s.year, s.semester
        `, [student_id]);

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

        // Corrected SQL query
        const [courses] = await db.query(`
            SELECT c.course_id, c.course_name, c.dept_name, c.credits,
                   s.sec_id, s.semester, s.year, s.building, s.room_number,
                   ts.day, ts.start_time, ts.end_time,
                   tchs.teacher_id, tchs.teacher_name
            FROM sections s
                     JOIN courses c ON s.course_id = c.course_id
                     LEFT JOIN time_slots ts ON s.time_slot_id = ts.time_slot_id
                     LEFT JOIN teaches tch ON s.course_id = tch.course_id
                AND s.sec_id = tch.sec_id
                AND s.semester = tch.semester
                AND s.year = tch.year
                     LEFT JOIN teachers tchs ON tch.teacher_id = tchs.teacher_id
            WHERE NOT EXISTS (
                SELECT 1 FROM takes t
                WHERE t.student_id = ?
                  AND t.course_id = s.course_id
                  AND t.sec_id = s.sec_id
                  AND t.semester = s.semester
                  AND t.year = s.year
            )
            ORDER BY s.year, s.semester
        `, [student_id]);

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
        const studentId = req.userData.id;
        const { course_id, sec_id, semester, year } = req.body;
        console.log(course_id);
        // First get student_id from students table using user_id
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = students[0].student_id;

        // Check if course is already taken
        const [existing] = await db.query(
            'SELECT * FROM takes WHERE student_id = ? AND course_id = ? AND sec_id = ? AND year = ? AND semester = ?',
            [student_id, course_id, sec_id, year, semester]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Course already taken' });
        }

        // Enroll student in course
        const [result] = await db.query(
            'INSERT INTO takes (student_id, course_id, sec_id, year, semester, grade) VALUES (?, ?, ?, ?, ?, ?)',
            [student_id, course_id, sec_id, year, semester, null]
        );

        res.status(201).json({
            message: 'Course enrolled successfully',
            takeId: result.insertId
        });
    } catch (error) {
        next(error);
    }
}

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
        const [result] = await db.query(
            'DELETE FROM takes WHERE student_id = ? AND course_id = ? AND sec_id = ? AND year = ? AND semester = ?',
            [student_id, course_id, sec_id, year, semester]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({
            message: 'Course dropped successfully'
        });
    } catch (error) {
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
        const [grades] = await db.query(`
            SELECT c.course_id, c.course_name, c.dept_name, c.credits, 
                   s.sec_id, s.semester, s.year, s.building, s.room_number,
                   ts.day, ts.start_time, ts.end_time,
                   tchs.teacher_id, tchs.teacher_name, t.grade
            FROM takes t
            JOIN sections s ON t.course_id = s.course_id 
                AND t.sec_id = s.sec_id 
                AND t.semester = s.semester 
                AND t.year = s.year
            JOIN courses c ON t.course_id = c.course_id
            LEFT JOIN time_slots ts ON s.time_slot_id = ts.time_slot_id
            LEFT JOIN teaches tch ON s.course_id = tch.course_id
                AND s.sec_id = tch.sec_id
                AND s.semester = tch.semester
                AND s.year = tch.year
            LEFT JOIN teachers tchs ON tch.teacher_id = tchs.teacher_id
            WHERE t.student_id = ?
            ORDER BY s.year, s.semester
        `, [student_id]);

        res.json({
            success: true,
            data: grades
        });
    } catch (error) {
        next(error);
    }
};