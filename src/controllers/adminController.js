// src/controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Admin Info
exports.getAdminInfo = async (req, res, next) => {
    try {
        const [admin] = await db.query('SELECT * FROM admins WHERE user_id = ?', [req.userData.id]);
        res.json({ success: true, data: admin });
    } catch (error) {
        next(error);
    }
};

// Course Management
exports.getAllCourses = async (req, res, next) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses');
        res.json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

exports.getCourseById = async (req, res, next) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses WHERE course_id = ?', [req.params.id]);

        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ success: true, data: courses[0] });
    } catch (error) {
        next(error);
    }
};

exports.addCourse = async (req, res, next) => {
    try {
        const { course_id, course_name, dept_name, credits } = req.body;

        if (!course_id || !course_name || !dept_name || !credits) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await db.query(
            'INSERT INTO courses (course_id, course_name, dept_name, credits) VALUES (?, ?, ?, ?)',
            [course_id, course_name, dept_name, credits]
        );

        res.status(201).json({ success: true, message: 'Course added successfully' });
    } catch (error) {
        next(error);
    }
};

exports.updateCourse = async (req, res, next) => {
    try {
        const { course_id, course_name, dept_name, credits } = req.body;

        await db.query(
            'UPDATE courses SET course_name = ?, dept_name = ?, credits = ? WHERE course_id = ?',
            [course_name, dept_name, credits, course_id]
        );

        res.json({ success: true, message: 'Course updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        const course_id = req.params.id;
        await db.query('DELETE FROM courses WHERE course_id = ?', [course_id]);
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Section Management
exports.getAllSections = async (req, res, next) => {
    try {
        const [sections] = await db.query('SELECT * FROM sections');
        res.json({ success: true, data: sections });
    } catch (error) {
        next(error);
    }
}

exports.getSectionById = async (req, res, next) => {
    try {
        const course_id = req.params.course_id;
        const [sections] = await db.query('SELECT * FROM sections WHERE course_id = ?', [course_id]);
        res.json({ success: true, data: sections });
    } catch (error) {
        next(error);
    }
}

exports.addSection = async (req, res, next) => {
    try {
        const { course_id, sec_id, semester, year, building, room_number, time_slot_id } = req.body;

        await db.query(
            'INSERT INTO sections (course_id, sec_id, semester, year, building, room_number, time_slot_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [course_id, sec_id, semester, year, building, room_number, time_slot_id]
        );

        res.status(201).json({ success: true, message: 'Section added successfully' });
    } catch (error) {
        next(error);
    }
}

exports.updateSection = async (req, res, next) => {
    try {
        const { course_id, sec_id, semester, year, building, room_number, time_slot_id } = req.body;

        await db.query(
            'UPDATE sections SET building = ?, room_number = ?, time_slot_id = ? WHERE course_id = ? AND sec_id = ? AND semester = ? AND year = ?',
            [building, room_number, time_slot_id, course_id, sec_id, semester, year]
        );

        res.json({ success: true, message: 'Section updated successfully' });
    } catch (error) {
        next(error);
    }
}

exports.deleteSection = async (req, res, next) => {
    try {
        const { courseId, secId, year, semester } = req.params;

        await db.query(
            'DELETE FROM sections WHERE course_id = ? AND sec_id = ? AND year = ? AND semester = ?',
            [courseId, secId, year, semester]
        );

        res.json({ success: true, message: 'Section deleted successfully' });
    } catch (error) {
        next(error);
    }
};
// Grade Management
exports.getAllGrades = async (req, res, next) => {
    try {
        const [grades] = await db.query(`
            SELECT t.student_id, t.student_id, s.student_name AS student_name, 
                   t.course_id, c.course_name, t.sec_id, 
                   t.semester, t.year, t.grade
            FROM takes t
            JOIN students s ON t.student_id = s.student_id
            JOIN courses c ON t.course_id = c.course_id
        `);

        res.json({ success: true, data: grades });
    } catch (error) {
        next(error);
    }
};

exports.getGradesByStudent = async (req, res, next) => {
    try {
        const studentId = req.params.student_id;

        const [grades] = await db.query(`
            SELECT t.student_id, t.course_id, c.course_name, t.sec_id, 
                   t.semester, t.year, t.grade
            FROM takes t
            JOIN courses c ON t.course_id = c.course_id
            WHERE t.student_id = ?
        `, [studentId]);

        res.json({ success: true, data: grades });
    } catch (error) {
        next(error);
    }
};

exports.addGrade = async (req, res, next) => {
    try {
        const { student_id, course_id, sec_id, semester, year, grade } = req.body;

        await db.query(
            'INSERT INTO takes (student_id, course_id, sec_id, semester, year, grade) VALUES (?, ?, ?, ?, ?, ?)',
            [student_id, course_id, sec_id, semester, year, grade]
        );

        res.status(201).json({ success: true, message: 'Grade added successfully' });
    } catch (error) {
        next(error);
    }
};

exports.updateGrade = async (req, res, next) => {
    try {
        const { grade } = req.body;
        const id = req.params.id;

        await db.query('UPDATE takes SET grade = ? WHERE ID = ?', [grade, id]);

        res.json({ success: true, message: 'Grade updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteGrade = async (req, res, next) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM takes WHERE ID = ?', [id]);

        res.json({ success: true, message: 'Grade record deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Student Management
exports.getAllStudents = async (req, res, next) => {
    try {
        const [students] = await db.query('SELECT * FROM students');
        res.json({ success: true, data: students });
    } catch (error) {
        next(error);
    }
};

// User Registration
exports.registerStudent = async (req, res, next) => {
    try {
        const { student_id, student_name, dept_name, major, year, tele, high_school, hometown, date_of_birth, email, user_id, user_name, password } = req.body;

        // Start a transaction to ensure both user and student are created
        await db.query('START TRANSACTION');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user with student role
        const [userResult] = await db.query(
            'INSERT INTO users (user_id, user_name, password, user_type) VALUES (?, ?, ?, ?)',
            [user_id, user_name, hashedPassword, 'student']
        );
        // Create student profile
        await db.query(
            'INSERT INTO students (student_id, student_name, user_id, dept_name, major, year, tot_cred, tele) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [student_id, student_name, user_id, dept_name, major, year, 0, tele]
        );



        const hasHighSchool = high_school !== undefined && high_school !== null && high_school !== '';
        const hasHometown = hometown !== undefined && hometown !== null && hometown !== '';
        const hasDateOfBirth = date_of_birth !== undefined && date_of_birth !== null && date_of_birth !== '';
        const hasEmail = email !== undefined && email !== null && email !== '';

        if (hasHighSchool || hasHometown || hasDateOfBirth || hasEmail) {
            // Build dynamic query
            const fields = ['student_id'];
            const values = [student_id];

            if (hasHighSchool) {
                fields.push('high_school');
                values.push(high_school);
            }

            if (hasHometown) {
                fields.push('hometown');
                values.push(hometown);
            }

            if (hasDateOfBirth) {
                fields.push('date_of_birth');
                values.push(date_of_birth);
            }

            if (hasEmail) {
                fields.push('email');
                values.push(email);
            }

            // Generate placeholders
            const placeholders = fields.map(() => '?').join(', ');

            // Insert into student_basic_info table
            const query = `INSERT INTO student_basic_info (${fields.join(', ')}) VALUES (${placeholders})`;
            await db.query(query, values);
        }

        // Commit the transaction
        await db.query('COMMIT');

        res.status(201).json({ success: true, message: 'Student registered successfully' });
    } catch (error) {
        // Rollback in case of error
        await db.query('ROLLBACK');
        next(error);
    }
};

exports.registerTeacher = async (req, res, next) => {
    try {
        const { teacher_id, teacher_name, dept_name, salary, tele, user_id, user_name, password } = req.body;

        // Start a transaction
        await db.query('START TRANSACTION');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with teacher role
        const [userResult] = await db.query(
            'INSERT INTO users (user_id, user_name, password, user_type) VALUES (?, ?, ?, ?)',
            [user_id, user_name, hashedPassword, 'teacher']
        );

        // Create teacher profile
        await db.query(
            'INSERT INTO teachers (teacher_id, teacher_name, user_id, dept_name, salary, tele) VALUES (?, ?, ?, ?, ?, ?)',
            [teacher_id, teacher_name, user_id, dept_name, salary, tele]
        );

        // Commit the transaction
        await db.query('COMMIT');

        res.status(201).json({ success: true, message: 'Teacher registered successfully' });
    } catch (error) {
        // Rollback in case of error
        await db.query('ROLLBACK');
        next(error);
    }
};

// Department Management
exports.getAllDepartments = async (req, res, next) => {
    try {
        const [departments] = await db.query('SELECT * FROM departments');
        res.json({ success: true, data: departments });
    } catch (error) {
        next(error);
    }
};

// User Management
exports.getUserMaxId = async (req, res, next) => {
    try {
        const [users] = await db.query('SELECT MAX(user_id) AS max_id FROM users');
        res.json({ success: true, data: users[0] });
    } catch (error) {
        next(error);
    }
}

//classroom management
exports.getAllClassrooms = async (req, res, next) => {
    try {
        const [classrooms] = await db.query('SELECT * FROM classrooms');
        res.json({ success: true, data: classrooms });
    } catch (error) {
        next(error);
    }
};

//time-slot management
exports.getAllTimeSlots = async (req, res, next) => {
    try {
        const [timeSlots] = await db.query('SELECT * FROM time_slots');
        res.json({ success: true, data: timeSlots });
    } catch (error) {
        next(error);
    }
};