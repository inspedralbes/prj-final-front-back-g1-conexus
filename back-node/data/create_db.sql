-- Table 1: departments
CREATE TABLE
    IF NOT EXISTS Departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Table 2: typeUsers
CREATE TABLE
    IF NOT EXISTS TypeUsers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Table 3: users
CREATE TABLE
    IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        typeUsers_id INT DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile VARCHAR(255),
        department_id INT,
        description TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (typeUsers_id) REFERENCES TypeUsers (id),
        FOREIGN KEY (department_id) REFERENCES Departments (id)
    );

-- Table 4: courses
CREATE TABLE
    IF NOT EXISTS Courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_name TEXT NOT NULL,
        course_hours_available JSON DEFAULT NULL,
        course_description TEXT NOT NULL,
        course_teacher_id INT DEFAULT NULL,
        course_department_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_teacher_id) REFERENCES Users (id) ON DELETE SET NULL,
        FOREIGN KEY (course_department_id) REFERENCES Departments (id)
    );

-- Table 5: userCourses
CREATE TABLE
    IF NOT EXISTS UserCourses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id),
        FOREIGN KEY (course_id) REFERENCES Courses (id) ON DELETE CASCADE
    );

-- Table 6: tasks
CREATE TABLE
    IF NOT EXISTS Tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        task_name TEXT NOT NULL,
        task_description TEXT NOT NULL,
        task_ended BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES Courses (id)
    );

-- Table 7: grades
CREATE TABLE
    IF NOT EXISTS Grades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        task_id INT NOT NULL,
        grade FLOAT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES Tasks (id)
    );

-- Table 8: assistence
CREATE TABLE
    IF NOT EXISTS Assistence (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        hour VARCHAR(255) NOT NULL,
        day DATE NOT NULL,
        assisted ENUM (
            'yes',
            'unjustified',
            'justified',
            'not selected',
            'late'
        ) DEFAULT 'unjustified',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES Courses (id)
    );

-- Table 9: lostObjects
CREATE TABLE
    IF NOT EXISTS LostObjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NULL,
        user_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE
    );

-- Table 10: responses
CREATE TABLE
    IF NOT EXISTS Responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        lostAndFound_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE SET NULL,
        FOREIGN KEY (lostAndFound_id) REFERENCES LostObjects (id)
    );

-- Table 11: rooms
CREATE TABLE
    IF NOT EXISTS Rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_name TEXT NOT NULL,
        room_hours_available JSON DEFAULT NULL,
        room_description TEXT NOT NULL,
        available BOOLEAN NOT NULL DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Table 12: roomReservations
CREATE TABLE
    IF NOT EXISTS RoomReservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        room_id INT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
        FOREIGN KEY (room_id) REFERENCES Rooms (id)
    );

-- Table 13: reports
CREATE TABLE
    IF NOT EXISTS Reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        report TEXT NOT NULL,
        status ENUM ('pending', 'revising', 'revised') DEFAULT 'pending',
        image TEXT,
        room_id INT NOT NULL,
        user_assigned INT DEFAULT NULL,
        note TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE SET NULL,
        FOREIGN KEY (room_id) REFERENCES Rooms (id)
    );

    -- Table 14: CanteenItems
    CREATE TABLE
        IF NOT EXISTS CanteenItems (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name TEXT NOT NULL,
            product_price FLOAT NOT NULL,
            product_enabled BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );