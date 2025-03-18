const db = require('../config/db');

// 获取老师信息
exports.getTeacherInfo = async (req, res, next) => {
    try {
        const teacherId = req.userData.id; // From auth middleware
        // First get student_id from students table using user_id
        const [teacher] = await db.query(
            'SELECT teacher_id FROM teachers WHERE user_id = ?',
            [teacherId]
        );

        if (teacher.length === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const teacher_id = teacher[0].teacher_id;
        const [teachers] = await db.query(
            'SELECT teacher_id, teacher_name, dept_name, salary, tele FROM teachers WHERE teacher_id = ?',
            [teacher_id]
        );
        res.json({
            success: true,
            teacher_name: teachers[0].teacher_name,
            teacher_id: teachers[0].teacher_id,
            dept_name: teachers[0].dept_name,
            tele: teachers[0].tele,
        });
    } catch (error) {
        next(error);
    }
};

// 获取老师的课程
exports.getTeacherCourses = async (req, res, next) => {
    try {
        const userId = req.userData.id;
        const [teacher] = await db.query(
            'SELECT teacher_id FROM teachers WHERE user_id = ?',
            [userId]
        );

        if (teacher.length === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        const teacher_id = teacher[0].teacher_id;

        const [results] = await db.query(`CALL getTeacherCourses(?)`,
            [teacher_id]
        );
        const courses = results[0];
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error:', error); // 详细的错误信息
        next(error);
    }
};

// 获取课程的学生
exports.getCourseStudents = async (req, res, next) => {
    try {
        const { courseId, secId,semester,year } = req.params;
        console.log(courseId);
        const [results] = await db.query(`CALL getCourseStudents(?, ?, ?, ?)`,
            [courseId, secId, semester, year]
        );
        const students = results[0];
        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        next(error);
    }
};

// 添加课程的学生
exports.addCourseStudent = async (req, res, next) => {
    try {
        const { studentId, courseId, secId, semester, year,grade } = req.body;
        const [result] = await db.query('INSERT INTO takes (student_id, course_id, sec_id, semester, year,grade) VALUES (?, ?, ?, ?, ?,?)',
            [studentId, courseId, secId, semester, year,grade]
        );

        res.status(201).json({
            message: 'Student added successfully',
            takeId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};


// 获取课程的成绩
exports.getCourseGrades = async (req, res, next) => {
    try {
        const { courseId, secId, semester, year } = req.params;
        const teacherId = req.userData.id; // From auth middleware

        // First verify the teacher teaches this course section
        const [teacherCourse] = await db.query(`
            SELECT * FROM teaches 
            WHERE teacher_id = (SELECT teacher_id FROM teachers WHERE user_id = ?)
            AND course_id = ?
            AND sec_id = ?
            AND semester = ?
            AND year = ?`,
            [teacherId, courseId, secId, semester, year]
        );

        if (teacherCourse.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view grades for this course section'
            });
        }

        // Get grades and student information
        const [grades] = await db.query(`
            SELECT 
                s.student_id,
                s.student_name,
                s.major,
                s.dept_name,
                t.grade,
                t.sec_id,
                t.semester,
                t.year
            FROM students s
            JOIN takes t ON s.student_id = t.student_id
            WHERE t.course_id = ?
            AND t.sec_id = ?
            AND t.semester = ?
            AND t.year = ?
            ORDER BY s.student_id`,
            [courseId, secId, semester, year]
        );

        res.json({
            success: true,
            data: grades
        });
    } catch (error) {
        next(error);
    }
};

// 添加成绩
exports.addGrade = async (req, res, next) => {
    try {
        const { studentId, courseId, secId, semester, year, grade } = req.body;
        const [result] = await db.query(
            `INSERT INTO takes (student_id, course_id, sec_id, semester, year, grade) 
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE grade = VALUES(grade)`,
            [studentId, courseId, secId, semester, year, grade]
        );

        res.status(201).json({
            success: true,
            message: result.affectedRows === 1 ? 'Grade added successfully' : 'Grade updated successfully',
            id: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// 更新成绩
exports.updateGrade = async (req, res, next) => {
    try {
        const { studentId, courseId, secId, semester, year } = req.params;
        const { grade } = req.body;
        const [result] = await db.query(
            'UPDATE takes SET grade = ? WHERE student_id = ? AND course_id = ? AND sec_id = ? AND semester = ? AND year = ?',
            [grade, studentId, courseId, secId, semester, year]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Grade not found' });
        }

        res.json({
            message: 'Grade updated successfully'
        });
    } catch (error) {
        next(error);
    }
};