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

INSERT INTO `Rooms` (`id`, `room_name`, `room_hours_available`, `room_description`) VALUES
(1, 'Sala de Informática 1', '{"monday":["08:00-10:00","10:00-12:00","16:00-18:00"],"tuesday":["09:00-11:00","14:00-16:00"],"wensday":["08:00-10:00","12:00-14:00"],"thursday":["10:00-12:00","15:00-17:00"],"friday":["09:00-11:00","13:00-15:00"]}', 'Aula con 25 ordenadores equipados con software de desarrollo y diseño'),
(2, 'Sala de Conferencias', '{"monday":["09:00-13:00","15:00-19:00"],"tuesday":["09:00-13:00","15:00-19:00"],"wensday":["09:00-13:00","15:00-19:00"],"thursday":["09:00-13:00","15:00-19:00"],"friday":["09:00-13:00","15:00-17:00"]}', 'Sala para eventos y presentaciones con capacidad para 50 personas'),
(3, 'Laboratorio DAM', '{"monday":["08:00-14:00"],"tuesday":["10:00-16:00"],"wensday":["08:00-14:00"],"thursday":["10:00-16:00"],"friday":["08:00-12:00"]}', 'Laboratorio especializado para estudiantes de Desarrollo de Aplicaciones Multiplataforma'),
(4, 'Aula Multimedia', '{"monday":["10:00-12:00","16:00-18:00"],"tuesday":["09:00-13:00"],"wensday":["14:00-18:00"],"thursday":["09:00-13:00"],"friday":["10:00-14:00"]}', 'Aula equipada con tecnología audiovisual para proyectos multimedia'),
(5, 'Sala de Reuniones', '{"monday":["09:00-20:00"],"tuesday":["09:00-20:00"],"wensday":["09:00-20:00"],"thursday":["09:00-20:00"],"friday":["09:00-17:00"]}', 'Sala para reuniones profesionales con capacidad para 12 personas');

INSERT INTO `Reports` (`id`, `user_id`, `report`, `status`, `image`, `room_id`, `user_assigned`) VALUES
(1, 1, 'El ordenador número 5 no arranca correctamente', 'pending', 'uploads/reports/image1.jpg', 1, NULL),
(2, 1, 'La iluminación de la sala falla intermitentemente', 'revising', 'uploads/reports/image2.jpg', 2, 4),
(3, 1, 'Falta una silla en la última fila', 'pending', NULL, 3, NULL),
(4, 1, 'El proyector muestra imágenes con colores distorsionados', 'revised', 'uploads/reports/image4.jpg', 2, 1),
(5, 1, 'El aire acondicionado hace ruido excesivo', 'pending', 'uploads/reports/image5.jpg', 5, NULL),
(6, 1, 'Varios ordenadores tienen el software desactualizado', 'revising', NULL, 1, 4),
(7, 1, 'Hay goteras en el techo cerca de la ventana', 'pending', 'uploads/reports/image7.jpg', 4, NULL),
(8, 3, 'La pizarra digital no responde correctamente', 'revised', 'uploads/reports/image8.jpg', 3, 1);