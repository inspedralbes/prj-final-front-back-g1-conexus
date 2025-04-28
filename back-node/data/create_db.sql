-- Create the database
CREATE DATABASE IF NOT EXISTS conexushub;

-- Use the database
USE conexushub;

-- Table 1: departments
CREATE TABLE IF NOT EXISTS Departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 2: typesUsers
CREATE TABLE IF NOT EXISTS TypesUsers (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    name VARCHAR(255) NOT NULL
);

-- Table 3: users 
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesUsers_id INT DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile VARCHAR(255),
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT DEFAULT NULL,
    FOREIGN KEY (typesUsers_id) REFERENCES TypesUsers(id),
    FOREIGN KEY (department_id) REFERENCES Departments(id)
);

-- Table 4: courses
CREATE TABLE IF NOT EXISTS Courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_hours_available JSON DEFAULT NULL,
    course_description TEXT NOT NULL,
    course_teacher_id INT,
    course_department_id INT NOT NULL,
    course_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_teacher_id) REFERENCES Users(id),
    FOREIGN KEY (course_department_id) REFERENCES Departments(id)
);

-- Table 5: usersCourses
CREATE TABLE IF NOT EXISTS UsersCourses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

-- Table 6: tasks
CREATE TABLE IF NOT EXISTS Tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    task_name TEXT NOT NULL,
    task_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

-- Table 7: grades
CREATE TABLE IF NOT EXISTS Grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    grade FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (task_id) REFERENCES Tasks(id)
);

-- Table 8: assistance
CREATE TABLE IF NOT EXISTS Assistance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    hour DATETIME NOT NULL,
    assisted ENUM('yes', 'unjustified', 'justified') DEFAULT 'unjustified',
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (course_id) REFERENCES Courses(id)
);

-- Table 9: lostObjects
CREATE TABLE IF NOT EXISTS LostObjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at DATE,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Table 10: response
CREATE TABLE IF NOT EXISTS Response (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lostAndFound_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (lostAndFound_id) REFERENCES LostObjects(id)
);

-- Table 11: rooms
CREATE TABLE IF NOT EXISTS Rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_name TEXT NOT NULL,
    room_hours_available JSON DEFAULT NULL,
    room_description TEXT NOT NULL
);

-- Table 12: roomReservations
CREATE TABLE IF NOT EXISTS RoomReservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (room_id) REFERENCES Rooms(id)
);

-- Table 13: reports
CREATE TABLE IF NOT EXISTS Reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report TEXT NOT NULL,
    status ENUM('pending', 'revising', 'revised') DEFAULT 'pending',
    image TEXT,
    room_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (room_id) REFERENCES Rooms(id)
);