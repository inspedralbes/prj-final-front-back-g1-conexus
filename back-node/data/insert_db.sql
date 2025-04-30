-- Insert data into departments
INSERT INTO Departments (name) VALUES 
('Administració i Gestió'),
('Informatica'),
('Màrqueting i Publicitat'),
('Comerç Internacional'),
('Desenvolupament d''Aplicacions Multiplataforma'),
('Desenvolupament d''Aplicacions Web');

-- Insert data into typesUsers
INSERT INTO TypeUsers (name) VALUES 
('Professor'),
('Estudiant'),
('Administrador'),
('Tècnic'),
('Cantina');

INSERT INTO `Users` (`id`, `typeUsers_id`, `name`, `email`, `password`, `profile`, `department_id`, `description`) VALUES
(1,	1,	'John Doe',	'john.doe@example.com',	'123456',	'path/to/banner.jpg',	NULL, 'Profesor de matemáticas'),
(3,	2,	'UserID3',	'john.doe@example.come',	'123456',	'path/to/banner.jpg', NULL, 'Profesor de matemáticas'),
(4,	2,	'UserID4',	'john.does@example.com',	'1234rt56',	'path/to/banner.jpg',	1, '3w4ertfyguhijklm,ñ');

INSERT INTO `Courses` (`id`, `course_name`, `course_hours_available`, `course_description`, `course_teacher_id`, `course_department_id`) VALUES
(2,	'Programación Web',	'{\"monday\": [\"09:00-11:00\", \"14:00-16:00\"]}',	'Curso de desarrollo web',	1,	2),
(3,	'DAM',	'{\"monday\": [\"09:00-11:00\", \"14:00-16:00\"]}',	'DAM',	1,	2);

INSERT INTO `Assistence` (`id`, `user_id`, `course_id`, `hour`, `day`, `assisted`) VALUES
(2,	3,	2,	'10:00-11:00',	'2025-04-21 00:00:00',	'yes'),
(3,	3,	2,	'9:00-10:00',	'2025-04-21 00:00:00',	'late');

INSERT INTO `Tasks` (`id`, `course_id`, `task_name`, `task_description`, `task_ended`) VALUES
(1,	2,	'Practica1',	'Fes un CRUD',	0),
(2,	2,	'Practuca2',	'Fes un ToDo list',	0),
(3,	2,	'Practica3',	'Fes la web de la nasa', 1);

INSERT INTO `Grades` (`id`, `user_id`, `task_id`, `grade`) VALUES
(1,	3,	1,	1),
(2,	3,	1,	9),
(3,	3,	1,	0),
(4,	3,	1,	9);

INSERT INTO `UserCourses` (`id`, `user_id`, `course_id`) VALUES
(1,	3,	2),
(2,	4,	2);
