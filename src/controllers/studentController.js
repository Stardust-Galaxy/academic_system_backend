// src/controllers/studentController.js
const db = require('../config/db');

exports.getStudentInfo = async (req, res, next) => {
    try {
        const studentId = req.userData.id; // From auth middleware

        const [students] = await db.query(
            'SELECT student_id, major, dept_name, year, tot_cred, tele FROM students WHERE user_id = ? ',
            [studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({
            success: true,
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
        console.log(schedules);
        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        next(error);
    }
};