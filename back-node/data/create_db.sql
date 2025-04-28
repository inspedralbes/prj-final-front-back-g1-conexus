-- Create the database
CREATE DATABASE IF NOT EXISTS conexus;

-- Use the database
USE conexus;

-- Table 1: classes
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 2: typesUsers
CREATE TABLE IF NOT EXISTS typesUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 3: users 
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesUsers_id INT DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    banner VARCHAR(255),
    profile VARCHAR(255),
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT DEFAULT NULL,
    FOREIGN KEY (typesUsers_id) REFERENCES typesUsers(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Table 4: courses
CREATE TABLE IF NOT EXISTS courses(
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_hours_available JSON DEFAULT NULL,
    course_description TEXT NOT NULL,
    course_teacher_id INT DEFAULT NULL,
    course_department_id INT NOT NULL,
    course_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_teacher_id) REFERENCES users(id),
    FOREIGN KEY (course_department_id) REFERENCES departments(id)
);

-- Table 5: usersCourses (depends on users and courses)
CREATE TABLE IF NOT EXISTS usersCourses(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Table 6: grades (depends on users and courses)
CREATE TABLE IF NOT EXISTS grades(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    grade FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Table 7: assistance (depends on users and courses)
CREATE TABLE IF NOT EXISTS assistance(
    id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     course_id INT NOT NULL,
     hour DATETIME NOT NULL,
     day INT NOT NULL,
     assisted ENUM('yes', 'unjustified', 'justified', 'not selected', 'late') DEFAULT 'unjustified',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (course_id) REFERENCES courses(id)
);
-- Table 8: lostObjects (depends on users and typeslostAndFound)
CREATE TABLE IF NOT EXISTS lostObjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at DATE,
    -- FOREIGN KEY (typeslostAndFound_id) REFERENCES typeslostAndFound(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table 8.1: response
CREATE TABLE IF NOT EXISTS response(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lostAndFound_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lostAndFound_id) REFERENCES lostObjects(id)
);

-- Table 9: rooms
CREATE TABLE IF NOT EXISTS rooms(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_name TEXT NOT NULL,
    room_hours_available JSON DEFAULT NULL,
    room_description TEXT NOT NULL
);

-- Table 10: roomsReservations (depends on users and rooms)
CREATE TABLE IF NOT EXISTS roomReservation(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Table 11: reportsUsers (depends on users)
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report TEXT NOT NULL,
    status ENUM('pending', 'revising', 'revised') DEFAULT 'pending',
    image TEXT,
    room_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);


-- Table 13: notifications (depends on users)
-- CREATE TABLE IF NOT EXISTS notifications (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     description TEXT NULL,
--     chat_id VARCHAR(255) NULL,
--     report_id INT NULL,
--     publication_id INT NULL,
--     request_id INT NULL,
--     comment_id INT NULL,
--     revised BOOLEAN DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id),
--     FOREIGN KEY (publication_id) REFERENCES lostObjects(id),
--     FOREIGN KEY (comment_id) REFERENCES comments(id)
-- );
