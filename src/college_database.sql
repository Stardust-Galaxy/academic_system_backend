/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80011 (8.0.11)
 Source Host           : localhost:3306
 Source Schema         : college_database

 Target Server Type    : MySQL
 Target Server Version : 80011 (8.0.11)
 File Encoding         : 65001

 Date: 18/03/2025 17:03:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins`  (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each admin',
  `admin_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`admin_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admins
-- ----------------------------
INSERT INTO `admins` VALUES (1, 'Stardust', 1);

-- ----------------------------
-- Table structure for classrooms
-- ----------------------------
DROP TABLE IF EXISTS `classrooms`;
CREATE TABLE `classrooms`  (
  `building` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Classroom\'s Building',
  `room_number` int(11) NOT NULL COMMENT 'Classroom\'s room number',
  `capacity` int(11) NOT NULL COMMENT 'Classroom\'s capacity',
  PRIMARY KEY (`building`, `room_number`) USING BTREE,
  INDEX `building`(`building` ASC) USING BTREE,
  INDEX `room_number`(`room_number` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of classrooms
-- ----------------------------
INSERT INTO `classrooms` VALUES ('Building Wang Xianghao', 209, 60);
INSERT INTO `classrooms` VALUES ('Building Wang Xianghao', 210, 60);
INSERT INTO `classrooms` VALUES ('Building Wang Xianghao', 211, 60);
INSERT INTO `classrooms` VALUES ('Building Wang Xianghao', 212, 60);
INSERT INTO `classrooms` VALUES ('Building Wang Xianghao', 213, 60);

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `course_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each course',
  `course_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Name of the course',
  `dept_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Department of the course',
  `credits` smallint(6) NOT NULL COMMENT 'Credits of the course',
  PRIMARY KEY (`course_id`) USING BTREE,
  INDEX `dept_name`(`dept_name` ASC) USING BTREE,
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`dept_name`) REFERENCES `departments` (`dept_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of courses
-- ----------------------------
INSERT INTO `courses` VALUES (1, 'Data Structure and Algorithm', 'CS', 5);
INSERT INTO `courses` VALUES (2, 'Introduction to programming', 'CS', 5);

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments`  (
  `dept_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Department\'s name',
  `building` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Department\'s building',
  `budget` decimal(20, 2) NULL DEFAULT NULL COMMENT 'Deparment\' budget',
  PRIMARY KEY (`dept_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES ('CS', 'Building Wang Xianghao', 20000.00);

-- ----------------------------
-- Table structure for sections
-- ----------------------------
DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections`  (
  `course_id` int(11) NOT NULL,
  `sec_id` int(11) NOT NULL,
  `semester` enum('Spring','Summer','Autumn','Winter') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `year` int(11) NOT NULL,
  `building` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `room_number` int(11) NULL DEFAULT NULL,
  `time_slot_id` int(11) NULL DEFAULT NULL,
  `capacity` int(5) NOT NULL,
  PRIMARY KEY (`sec_id`, `course_id`, `semester`, `year`) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  INDEX `building`(`building` ASC) USING BTREE,
  INDEX `room_number`(`room_number` ASC) USING BTREE,
  INDEX `time_slot_id`(`time_slot_id` ASC) USING BTREE,
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_2` FOREIGN KEY (`building`) REFERENCES `classrooms` (`building`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_3` FOREIGN KEY (`room_number`) REFERENCES `classrooms` (`room_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_4` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots` (`time_slot_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sections
-- ----------------------------
INSERT INTO `sections` VALUES (1, 1, 'Spring', 2025, 'Building Wang Xianghao', 209, 2, 2);
INSERT INTO `sections` VALUES (2, 1, 'Spring', 2025, 'Building Wang Xianghao', 211, 3, 2);
INSERT INTO `sections` VALUES (1, 2, 'Spring', 2024, 'Building Wang Xianghao', 210, 3, 2);

-- ----------------------------
-- Table structure for student_basic_info
-- ----------------------------
DROP TABLE IF EXISTS `student_basic_info`;
CREATE TABLE `student_basic_info`  (
  `student_id` int(11) NOT NULL,
  `high_school` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `hometown` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `date_of_birth` datetime NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`student_id`) USING BTREE,
  INDEX `student_id`(`student_id` ASC) USING BTREE,
  CONSTRAINT `student_basic_info_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of student_basic_info
-- ----------------------------
INSERT INTO `student_basic_info` VALUES (21220229, '吉林', '吉林', '2025-03-18 00:00:00', '12356');
INSERT INTO `student_basic_info` VALUES (21220334, '沈阳实验', '沈阳', '2025-03-17 00:00:00', '123123');
INSERT INTO `student_basic_info` VALUES (21220416, 'High School Affiliated to Nanjing Normal University', 'Nanjing', '2003-11-18 00:00:00', 'stardust122110@gmail.com');

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `student_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each student',
  `student_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Links to Users table',
  `major` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Student’s major',
  `dept_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Student\'s department',
  `year` smallint(6) NOT NULL COMMENT 'Year of study (e.g., 1, 2, 3, 4)',
  `tot_cred` int(10) UNSIGNED ZEROFILL NOT NULL COMMENT 'Student\'s total credits',
  `tele` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`student_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `dept_name`(`dept_name` ASC) USING BTREE,
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`dept_name`) REFERENCES `departments` (`dept_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 21229418 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES (21220229, 'heyuxin', 6, 'Math', 'CS', 2022, 0000000000, '123456');
INSERT INTO `students` VALUES (21220334, 'wjs', 5, 'Computer Science', 'CS', 2022, 0000000000, '123');
INSERT INTO `students` VALUES (21220416, 'Jinfeng Wang', 2, 'Computer Science', 'CS', 3, 0000000005, '13585172255');

-- ----------------------------
-- Table structure for takes
-- ----------------------------
DROP TABLE IF EXISTS `takes`;
CREATE TABLE `takes`  (
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `sec_id` int(11) NOT NULL,
  `semester` enum('Spring','Summer','Autumn','Winter') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `year` int(11) NOT NULL,
  `grade` enum('A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`student_id`, `course_id`, `sec_id`, `semester`, `year`) USING BTREE,
  INDEX `course_id`(`course_id` ASC, `sec_id` ASC, `semester` ASC, `year` ASC) USING BTREE,
  CONSTRAINT `takes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `takes_ibfk_2` FOREIGN KEY (`course_id`, `sec_id`, `semester`, `year`) REFERENCES `sections` (`course_id`, `sec_id`, `semester`, `year`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of takes
-- ----------------------------
INSERT INTO `takes` VALUES (21220334, 1, 1, 'Spring', 2025, 'A+');
INSERT INTO `takes` VALUES (21220334, 1, 2, 'Spring', 2024, 'B-');
INSERT INTO `takes` VALUES (21220416, 1, 1, 'Spring', 2025, 'A+');
INSERT INTO `takes` VALUES (21220416, 1, 2, 'Spring', 2024, 'F');

-- ----------------------------
-- Table structure for teachers
-- ----------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers`  (
  `teacher_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each teacher',
  `teacher_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Teacher\'s name',
  `user_id` int(11) NOT NULL COMMENT 'Links to Users table',
  `dept_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Teacher\'s department',
  `salary` decimal(10, 2) NOT NULL COMMENT 'Teacher\'s salary',
  `tele` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Teacher\'s tele',
  PRIMARY KEY (`teacher_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `dept_name`(`dept_name` ASC) USING BTREE,
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`dept_name`) REFERENCES `departments` (`dept_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 602549 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of teachers
-- ----------------------------
INSERT INTO `teachers` VALUES (1, 'Wei Wang', 3, 'CS', 10000.00, '911');
INSERT INTO `teachers` VALUES (2, 'zhangqijin', 4, 'CS', 10000.00, '13781055015');

-- ----------------------------
-- Table structure for teaches
-- ----------------------------
DROP TABLE IF EXISTS `teaches`;
CREATE TABLE `teaches`  (
  `teacher_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `sec_id` int(11) NOT NULL,
  `semester` enum('Spring','Summer','Autumn','Winter') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `year` int(11) NOT NULL,
  PRIMARY KEY (`teacher_id`, `course_id`, `sec_id`, `semester`, `year`) USING BTREE,
  INDEX `course_id`(`course_id` ASC, `sec_id` ASC, `semester` ASC, `year` ASC) USING BTREE,
  CONSTRAINT `teaches_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teaches_ibfk_2` FOREIGN KEY (`course_id`, `sec_id`, `semester`, `year`) REFERENCES `sections` (`course_id`, `sec_id`, `semester`, `year`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of teaches
-- ----------------------------
INSERT INTO `teaches` VALUES (2, 1, 1, 'Spring', 2025);
INSERT INTO `teaches` VALUES (2, 1, 2, 'Spring', 2024);
INSERT INTO `teaches` VALUES (2, 2, 1, 'Spring', 2025);

-- ----------------------------
-- Table structure for time_slots
-- ----------------------------
DROP TABLE IF EXISTS `time_slots`;
CREATE TABLE `time_slots`  (
  `time_slot_id` int(11) NOT NULL AUTO_INCREMENT,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NULL DEFAULT NULL,
  PRIMARY KEY (`time_slot_id`, `day`, `start_time`) USING BTREE,
  INDEX `time_slot_id`(`time_slot_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of time_slots
-- ----------------------------
INSERT INTO `time_slots` VALUES (1, 'Monday', '08:00:00', '10:00:00');
INSERT INTO `time_slots` VALUES (2, 'Monday', '12:00:00', '14:00:00');
INSERT INTO `time_slots` VALUES (3, 'Monday', '14:00:00', '16:00:00');
INSERT INTO `time_slots` VALUES (4, 'Tuesday', '08:00:00', '10:00:00');
INSERT INTO `time_slots` VALUES (5, 'Monday', '00:00:00', NULL);
INSERT INTO `time_slots` VALUES (6, 'Tuesday', '12:00:00', '14:00:00');
INSERT INTO `time_slots` VALUES (7, 'Wednesday', '08:00:00', '12:00:00');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for each user',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Login username (unique across users)',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Hashed password for security',
  `user_type` enum('student','teacher','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Type of user',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Stardust', '$2b$10$thqZC4K9PmXKVxBgTV7I8.2BtiyY5xRd0dvFXBLFx/feKWiFRI322', 'admin');
INSERT INTO `users` VALUES (2, 'JinfengWang_21220416', '$2b$10$KZMGblb92OXapX0/COM8cuefn47S7LVpAoGVxvf5EWjgpTCk9Ig5y', 'student');
INSERT INTO `users` VALUES (3, 'WeiWang_000001', '$2b$10$DPDeVrs72jOI8MXTsATmheDAadB9JG5WHPT7uCCb.CeMTmXrNp/5O', 'teacher');
INSERT INTO `users` VALUES (4, 'zhangqijin_2', '$2b$10$mHp2Qoxk24QNoibn1ysOSOf2JT9ZTa98jghCHPFOUrxptFxJrfi8.', 'teacher');
INSERT INTO `users` VALUES (5, 'wjs_21220334', '$2b$10$aXPCsKtZsR9r5eM0GHaqQOlPXaY9HR4zJgmVtrHRsJEKfwnRsvq5e', 'student');
INSERT INTO `users` VALUES (6, 'heyuxin_21220229', '$2b$10$JkDt7iD58yRQqUhGyFLZjuPEjLnHfBw3dT/Yv6ILaYLYT4i1AHC9a', 'student');

-- ----------------------------
-- Procedure structure for getSectionAndTeacher
-- ----------------------------
DROP PROCEDURE IF EXISTS `getSectionAndTeacher`;
delimiter ;;
CREATE PROCEDURE `getSectionAndTeacher`()
BEGIN
    -- 直接执行 SELECT 查询，结果集会返回给客户端
    SELECT 
        s.course_id, s.sec_id, s.semester, s.year,
        s.building, s.room_number, s.time_slot_id,
				s.capacity,
        t.teacher_id, t.teacher_name
    FROM sections s
    LEFT JOIN teaches tc ON 
        s.course_id = tc.course_id
        AND s.sec_id = tc.sec_id
        AND s.semester = tc.semester
        AND s.year = tc.year
    LEFT JOIN teachers t ON tc.teacher_id = t.teacher_id
    ORDER BY s.course_id, s.sec_id, s.year, s.semester;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
