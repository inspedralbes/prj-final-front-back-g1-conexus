-- Configurar codificación para este archivo
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- ===================================
-- DEPARTAMENTOS
-- ===================================
INSERT INTO Departments (name) VALUES 
('Administració i Gestió'),
('Informàtica'),
('Màrqueting i Publicitat'),
('Comerç Internacional'),
('Desenvolupament d''Aplicacions Multiplataforma'),
('Desenvolupament d''Aplicacions Web'),
('Disseny Gràfic'),
('Administració de Sistemes'),
('Ciberseguretat'),
('Intel·ligència Artificial'),
('Big Data i Analítica');

-- ===================================
-- TIPOS DE USUARIOS
-- ===================================
INSERT INTO TypeUsers (name) VALUES 
('Professor'),
('Estudiant'),
('Administrador'),
('Tècnic'),
('Cantina');

-- ===================================
-- USUARIOS
-- ===================================
INSERT INTO Users (typeUsers_id, name, email, password, profile, department_id, description) VALUES 
-- Profesores
(1, 'Joan Farrés', 'joan.farres@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/default_teacher.jpg', 2, 'Professor de Programació i Bases de Dades amb 15 anys d''experiència'),
(1, 'Maria Garcia', 'maria.garcia@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/maria.jpg', 2, 'Professora de Desenvolupament Web amb 10 anys d''experiència'),
(1, 'Josep Martí', 'josep.marti@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/josep.jpg', 5, 'Professor de DAM especialitzat en aplicacions mòbils'),
(1, 'Laura Puig', 'laura.puig@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/laura.jpg', 1, 'Professora d''Administració Financera'),
(1, 'Sergi Rovira', 'sergi.rovira@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/sergi.jpg', 3, 'Professor de Màrqueting Digital'),
(1, 'Clara Font', 'clara.font@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/clara.jpg', 4, 'Professora de Comerç Internacional i Logística'),
(1, 'Arnau Costa', 'arnau.costa@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/arnau.jpg', 7, 'Professor de Disseny d''Interfícies'),

-- Estudiantes
(2, 'Marc Vidal', 'a22marc.vidal@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/marc.jpg', 2, 'Estudiant de segon curs de DAM'),
(2, 'Júlia Ferrer', 'a23julia.ferrer@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/julia.jpg', 6, 'Estudiant de primer curs de DAW'),
(2, 'Pau Soler', 'a21pau.soler@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/pau.jpg', 5, 'Estudiant d''últim curs d''Intel·ligència Artificial'),
(2, 'Aina Costa', 'a22aina.costa@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/aina.jpg', 1, 'Estudiant de segon curs d''Administració'),
(2, 'Oriol Mas', 'a23oriol.mas@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/oriol.jpg', 3, 'Estudiant de primer curs de Màrqueting Digital'),
(2, 'Marta Pujol', 'a21marta.pujol@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/marta.jpg', 7, 'Estudiant de Disseny Gràfic'),
(2, 'Jan Roca', 'a22jan.roca@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/jan.jpg', 6, 'Estudiant d''últim curs de DAW'),
(2, 'Laia Sanz', 'a23laia.sanz@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/laia.jpg', 2, 'Estudiant de primer curs d''Informàtica'),
(2, 'Biel Ferrer', 'a22biel.ferrer@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/biel.jpg', 5, 'Estudiant de segon curs de DAM'),
(2, 'Carla Martí', 'a21carla.marti@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/carla.jpg', 4, 'Estudiant d''últim curs de Comerç Internacional'),

-- Administradores
(3, 'Montserrat Pujol', 'montserrat.pujol@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/montse.jpg', NULL, 'Directora del centre'),
(3, 'Jordi Coll', 'jordi.coll@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/jordi.jpg', NULL, 'Cap d''estudis'),
(3, 'Elena Valls', 'elena.valls@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/elena_admin.jpg', NULL, 'Secretària acadèmica'),

-- Técnicos
(4, 'Carles Riera', 'carles.riera@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/carles.jpg', 8, 'Tècnic informàtic especialitzat en xarxes'),
(4, 'Núria Solé', 'nuria.sole@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/nuria.jpg', 9, 'Tècnica de ciberseguretat'),
(4, 'David Bosch', 'david.bosch@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/david.jpg', 2, 'Tècnic de suport informàtic'),

-- Cantina
(5, 'Miquel Ros', 'miquel.ros@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/miquel.jpg', NULL, 'Responsable de la cantina'),
(5, 'Elena Font', 'elena.font@conexus.cat', '$2b$10$1qAz2wSx3eCc3NkYMBNKYervePQZn/6KBXG5pNEWKnYqidUGBKp.m', 'uploads/profiles/elena.jpg', NULL, 'Ajudant de cantina');

-- ===================================
-- CURSOS
-- ===================================
INSERT INTO Courses (course_name, course_hours_available, course_description, course_teacher_id, course_department_id) VALUES 
('Programació Web', '{"monday": ["09:00-11:00"], "wednesday": ["09:00-11:00"]}', 'Curs de desenvolupament web amb HTML, CSS i JavaScript', 1, 6),
('Bases de Dades Relacionals', '{"tuesday": ["11:00-13:00"], "thursday": ["11:00-13:00"]}', 'Introducció als sistemes gestors de bases de dades i SQL', 1, 2),
('Desenvolupament d''Aplicacions amb Java', '{"monday": ["15:00-17:00"], "wednesday": ["15:00-17:00"], "friday": ["11:00-13:00"]}', 'Curs intensiu de programació Java per a aplicacions empresarials', 2, 5),
('Desenvolupament Frontend', '{"tuesday": ["09:00-11:00"], "friday": ["09:00-11:00"]}', 'Desenvolupament d''interfícies d''usuari amb React i Angular', 2, 6),
('Bases de Dades NoSQL', '{"tuesday": ["16:00-18:00"], "thursday": ["16:00-18:00"]}', 'Introducció a bases de dades no relacionals: MongoDB, Redis i Cassandra', 3, 10),
('Desenvolupament Mòbil Android', '{"monday": ["11:00-13:00"], "wednesday": ["11:00-13:00"]}', 'Creació d''aplicacions natives per a dispositius Android', 3, 5),
('Administració Financera', '{"monday": ["15:00-17:00"], "wednesday": ["15:00-17:00"]}', 'Gestió econòmica i financera per a empreses mitjanes', 4, 1),
('Comptabilitat Avançada', '{"tuesday": ["15:00-17:00"], "thursday": ["15:00-17:00"]}', 'Tècniques avançades de comptabilitat i anàlisi de balanços', 4, 1),
('Màrqueting Digital', '{"monday": ["11:00-13:00"], "thursday": ["14:00-16:00"]}', 'Estratègies de màrqueting en entorns digitals', 5, 3),
('Gestió de Xarxes Socials', '{"wednesday": ["16:00-18:00"], "friday": ["16:00-18:00"]}', 'Gestió professional de campanyes a xarxes socials i anàlisi de resultats', 5, 3),
('Logística Internacional', '{"tuesday": ["09:00-11:00"], "friday": ["09:00-11:00"]}', 'Distribució i logística en el comerç internacional', 6, 4),
('Comerç Exterior', '{"monday": ["09:00-11:00"], "wednesday": ["09:00-11:00"]}', 'Marc legal i pràctic del comerç exterior', 6, 4),
('Disseny d''Interfícies d''Usuari', '{"tuesday": ["11:00-14:00"], "thursday": ["11:00-14:00"]}', 'Principis de UX/UI i implementació pràctica', 7, 7),
('Disseny Gràfic per a Web', '{"wednesday": ["14:00-16:00"], "friday": ["14:00-16:00"]}', 'Eines i tècniques de disseny per a entorns web', 7, 7);

-- ===================================
-- INSCRIPCIONES DE USUARIOS A CURSOS
-- ===================================
INSERT INTO UserCourses (user_id, course_id) VALUES 
(8, 1), (8, 2), -- Marc está en dos cursos
(9, 3), (9, 4), -- Julia en dos cursos
(10, 5), (10, 6), -- Pau en dos cursos
(11, 7), (11, 8), -- Aina en dos cursos
(12, 9), (12, 10), -- Oriol en dos cursos
(13, 13), (13, 14), -- Marta en dos cursos
(14, 1), (14, 4), -- Jan en dos cursos
(15, 2), -- Laia en un curso
(16, 3), (16, 6), -- Biel en dos cursos
(17, 11), (17, 12); -- Carla en dos cursos

-- ===================================
-- TAREAS PARA LOS CURSOS
-- ===================================
INSERT INTO Tasks (course_id, task_name, task_description, task_ended) VALUES 
-- Tareas para Programación Web
(1, 'Creació d''una pàgina web personal', 'Desenvolupar un lloc web personal amb HTML i CSS seguint les millors pràctiques', 1),
(1, 'Implementació de JavaScript interactiu', 'Afegir funcionalitats interactives utilitzant JavaScript i manipulació del DOM', 0),
(1, 'Projecte final: Aplicació web completa', 'Crear una aplicació web completa que integri totes les tecnologies apreses', 0),

-- Tareas para Bases de Datos Relacionales
(2, 'Disseny de model entitat-relació', 'Crear un model entitat-relació complet per a un sistema de gestió d''inventari', 1),
(2, 'Implementació de consultes SQL', 'Desenvolupar consultes SQL complexes incloent joins, subqueries i agregacions', 1),
(2, 'Desenvolupament d''un SGBD complet', 'Implementar un sistema complet de gestió de base de dades amb transaccions', 0),

-- Tareas para Desarrollo de Aplicaciones con Java
(3, 'Aplicació de gestió bancària', 'Desenvolupar una aplicació completa amb Java per gestionar comptes bancaris', 1),
(3, 'API REST amb Spring Boot', 'Implementar una API RESTful utilitzant Spring Boot', 0),
(3, 'Aplicació amb interfície gràfica', 'Crear una aplicació d''escriptori amb JavaFX', 0),

-- Tareas para otras asignaturas
(4, 'Creació d''un component React', 'Desenvolupar un component reutilitzable amb React', 1),
(5, 'Disseny d''esquema per MongoDB', 'Crear un esquema optimitzat per a una aplicació de comerç electrònic', 1),
(6, 'App Android amb Kotlin', 'Desenvolupar una aplicació Android utilitzant Kotlin', 0),
(7, 'Anàlisi de balanços', 'Realitzar un informe complet d''anàlisi de balanços d''una empresa fictícia', 1),
(8, 'Pla de comptabilitat', 'Desenvolupar un pla de comptabilitat complet per a una PIME', 0),
(9, 'Campanya de màrqueting digital', 'Dissenyar una campanya completa de màrqueting digital', 1),
(10, 'Estratègia per a xarxes socials', 'Crear una estratègia completa per a la presència en xarxes socials', 0),
(11, 'Pla de distribució internacional', 'Desenvolupar un pla logístic per a distribució internacional', 1),
(12, 'Anàlisi de mercat internacional', 'Realitzar un estudi de mercat per a expansió internacional', 0),
(13, 'Prototip de web responsive', 'Dissenyar un prototip d''alta fidelitat per a un lloc web adaptatiu', 0),
(14, 'Creació d''identitat visual', 'Desenvolupar la identitat visual completa per a una marca', 1);

-- ===================================
-- CALIFICACIONES PARA TAREAS
-- ===================================
INSERT INTO Grades (user_id, task_id, grade) VALUES 
-- Calificaciones de Marc
(8, 1, 8.5), -- Marc en la primera tarea de Programación Web
(8, 2, 7.8), -- Marc en la segunda tarea de Programación Web
(8, 4, 9.2), -- Marc en la primera tarea de Bases de Datos
(8, 5, 8.7), -- Marc en la segunda tarea de Bases de Datos

-- Calificaciones de Julia
(9, 7, 9.0), -- Julia en la primera tarea de Java
(9, 10, 8.3), -- Julia en la tarea de React

-- Calificaciones de Pau
(10, 11, 7.5), -- Pau en la tarea de MongoDB
(10, 12, 8.0), -- Pau en la tarea de Android

-- Calificaciones de otros estudiantes
(11, 13, 9.5), -- Aina en análisis de balances
(12, 15, 7.2), -- Oriol en campaña de marketing
(13, 19, 8.8), -- Marta en prototipo web
(14, 1, 9.1), -- Jan en página web personal
(14, 10, 7.7), -- Jan en componente React
(15, 4, 8.2), -- Laia en modelo entidad-relación
(16, 7, 9.3), -- Biel en aplicación bancaria
(17, 17, 8.5); -- Carla en plan de distribución

-- ===================================
-- ASISTENCIAS A CLASES
-- ===================================
INSERT INTO Assistence (user_id, course_id, hour, day, assisted) VALUES 
-- Asistencias de Marc a Programación Web
(8, 1, '09:00-11:00', '2025-05-06', 'yes'),
(8, 1, '09:00-11:00', '2025-05-08', 'late'),
(8, 1, '09:00-11:00', '2025-05-13', 'yes'),
(8, 1, '09:00-11:00', '2025-05-15', 'yes'),
(8, 1, '09:00-11:00', '2025-05-20', 'unjustified'),

-- Asistencias de Marc a Bases de Datos
(8, 2, '11:00-13:00', '2025-05-07', 'yes'),
(8, 2, '11:00-13:00', '2025-05-09', 'yes'),
(8, 2, '11:00-13:00', '2025-05-14', 'yes'),
(8, 2, '11:00-13:00', '2025-05-16', 'justified'),

-- Asistencias de Julia a Java
(9, 3, '15:00-17:00', '2025-05-06', 'yes'),
(9, 3, '15:00-17:00', '2025-05-08', 'yes'),
(9, 3, '15:00-17:00', '2025-05-13', 'late'),
(9, 3, '11:00-13:00', '2025-05-17', 'yes'),

-- Asistencias de Pau a NoSQL
(10, 5, '16:00-18:00', '2025-05-07', 'yes'),
(10, 5, '16:00-18:00', '2025-05-09', 'unjustified'),
(10, 5, '16:00-18:00', '2025-05-14', 'yes'),
(10, 5, '16:00-18:00', '2025-05-16', 'yes'),

-- Asistencias de diferentes estudiantes a diferentes cursos
(11, 7, '15:00-17:00', '2025-05-06', 'yes'),
(12, 9, '11:00-13:00', '2025-05-06', 'late'),
(13, 13, '11:00-14:00', '2025-05-07', 'yes'),
(14, 1, '09:00-11:00', '2025-05-06', 'yes'),
(15, 2, '11:00-13:00', '2025-05-07', 'justified'),
(16, 3, '15:00-17:00', '2025-05-06', 'yes'),
(17, 11, '09:00-11:00', '2025-05-07', 'yes');

-- ===================================
-- OBJETOS PERDIDOS
-- ===================================
INSERT INTO LostObjects (title, description, image, user_id) VALUES 
('Portàtil Dell trobat a l''aula 204', 'He trobat un portàtil Dell negre amb adhesius a la tapa a l''aula 204 després de la classe de Programació', 'uploads/lost/laptop.jpg', 8),
('Claus perdudes a la cantina', 'He perdut un clauer amb 3 claus i un portaclaus de fusta amb la inicial "A" a la cantina ahir a l''hora de dinar', 'uploads/lost/keys.jpg', 11),
('Auriculars sense fil', 'S''han trobat uns auriculars sense fil blancs a la biblioteca. Preguntar a recepció.', 'uploads/lost/earphones.jpg', 6),
('Llibreta d''apunts de Bases de Dades', 'He perdut una llibreta blava amb tots els meus apunts de Bases de Dades. És molt important per a mi!', NULL, 9),
('Carregador MacBook', 'He trobat un carregador de MacBook a l''aula d''informàtica 2', 'uploads/lost/charger.jpg', 10),
('USB amb treballs de Disseny', 'He perdut un pendrive negre de 64GB amb tots els meus treballs de Disseny Gràfic. Té una etiqueta amb les inicials LP.', NULL, 13),
('Jaqueta negra Nike', 'Vaig oblidar la meva jaqueta negra de Nike a l''aula 105 la setmana passada. Si algú l''ha vist, agraïria que m''ho fes saber.', 'uploads/lost/jacket.jpg', 16),
('Calculadora científica', 'He trobat una calculadora científica Casio a la sala d''estudi', 'uploads/lost/calculator.jpg', 4);

-- ===================================
-- RESPUESTAS A OBJETOS PERDIDOS
-- ===================================
INSERT INTO Responses (user_id, lostAndFound_id, comment) VALUES 
(10, 1, 'Crec que és del meu company Martí. Li enviaré un missatge.'),
(8, 2, 'He vist unes claus similars a consergeria. Potser les han portat allà.'),
(9, 3, 'Són uns AirPods? Perquè jo n''he perdut uns fa poc...'),
(10, 4, 'Jo tinc una llibreta que vaig trobar a l''aula 108. Té el teu nom?'),
(6, 5, 'Gràcies! És meu. Quan podria passar a recollir-lo?'),
(7, 5, 'Si no el recull ningú en un parell de dies, el portaré a consergeria.'),
(15, 6, 'Jo també vaig perdre un pendrive similar. Podria ser el meu?'),
(9, 7, 'Crec que l''he vist a l''aula de professors. Preguntaré demà.'),
(12, 8, 'És meva! La vaig perdre la setmana passada. Podria passar a recollir-la demà al matí?');

-- ===================================
-- SALAS
-- ===================================
INSERT INTO Rooms (room_name, room_hours_available, room_description, available) VALUES 
('Aula 101', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Aula estàndard amb capacitat per a 30 alumnes, equipada amb projector i ordinador', 1),
('Aula 102', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Aula estàndard amb capacitat per a 30 alumnes, equipada amb projector i ordinador', 1),
('Laboratori Informàtica 1', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Laboratori amb 30 ordinadors equipats amb software de desenvolupament', 1),
('Laboratori Informàtica 2', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Laboratori amb 30 ordinadors equipats amb software de disseny i multimèdia', 1),
('Sala de Conferències', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Sala per a esdeveniments amb capacitat per a 100 persones, equipada amb sistemes audiovisuals avançats', 1),
('Sala de Reunions 1', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Sala per a reunions amb capacitat per a 12 persones amb projector i pissarra', 1),
('Sala de Reunions 2', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Sala per a reunions amb capacitat per a 8 persones amb pissarra digital', 1),
('Laboratori de Hardware', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Espai especialitzat per a pràctiques de muntatge i reparació d''equips', 1),
('Aula de Disseny', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Aula equipada amb estacions de treball Mac per a disseny gràfic i audiovisual', 1),
('Biblioteca', '{"monday":["08:00-20:00"],"tuesday":["08:00-20:00"],"wednesday":["08:00-20:00"],"thursday":["08:00-20:00"],"friday":["08:00-18:00"]}', 'Espai d''estudi i consulta amb col·lecció de llibres especialitzats i accés a bases de dades', 1);

-- ===================================
-- RESERVAS DE SALAS
-- ===================================
INSERT INTO RoomReservations (user_id, room_id, start_time, end_time) VALUES 
(1, 3, '2025-05-20 09:00:00', '2025-05-20 11:00:00'), -- Profesor Joan reserva el Lab. Informática 1
(2, 5, '2025-05-21 15:00:00', '2025-05-21 17:00:00'), -- Profesora Maria reserva la Sala de Conferencias
(3, 4, '2025-05-22 11:00:00', '2025-05-22 13:00:00'), -- Profesor Josep reserva el Lab. Informática 2
(4, 6, '2025-05-23 10:00:00', '2025-05-23 12:00:00'), -- Profesora Laura reserva la Sala de Reuniones 1
(7, 9, '2025-05-24 16:00:00', '2025-05-24 18:00:00'), -- Profesor Arnau reserva el Aula de Diseño
(8, 3, '2025-05-25 14:00:00', '2025-05-25 16:00:00'), -- Estudiante Marc reserva el Lab. Informática 1
(9, 4, '2025-05-26 17:00:00', '2025-05-26 19:00:00'), -- Estudiante Julia reserva el Lab. Informática 2
(10, 8, '2025-05-27 15:00:00', '2025-05-27 17:00:00'), -- Estudiante Pau reserva el Lab. Hardware
(18, 5, '2025-05-28 10:00:00', '2025-05-28 12:00:00'), -- Administrador Jordi reserva la Sala de Conferencias
(21, 1, '2025-05-29 09:00:00', '2025-05-29 11:00:00'); -- Técnico Carles reserva el Aula 101

-- ===================================
-- REPORTES DE PROBLEMAS
-- ===================================
INSERT INTO Reports (user_id, report, status, image, room_id, user_assigned, note) VALUES 
(8, 'El teclat de l''ordinador 12 té algunes tecles que no funcionen', 'pending', 'uploads/reports/keyboard.jpg', 3, NULL, NULL),
(9, 'La cadira del meu lloc està trencada', 'revising', 'uploads/reports/chair.jpg', 2, 22, 'Programada substitució per al proper dilluns'),
(10, 'La connexió a Internet es talla constantment', 'pending', NULL, 4, NULL, NULL),
(11, 'El projector no mostra els colors correctament', 'revised', 'uploads/reports/projector.jpg', 1, 21, 'Projector substituït el 15/05/2025'),
(12, 'L''aire condicionat no funciona correctament', 'pending', 'uploads/reports/ac.jpg', 5, NULL, NULL),
(13, 'La pissarra digital no respon al tacte', 'revising', 'uploads/reports/board.jpg', 9, 22, 'S''ha sol·licitat servei tècnic especialitzat'),
(14, 'Falten endolls per als portàtils', 'revised', NULL, 10, 21, 'S''han instal·lat regletes addicionals'),
(15, 'Les cortines estan descosides i no es poden tancar', 'pending', 'uploads/reports/curtains.jpg', 2, NULL, NULL),
(16, 'Software desactualitzat als ordinadors de l''aula', 'revising', NULL, 3, 23, 'Programada actualització general per al cap de setmana'),
(17, 'Hi ha una gotera al sostre prop de la finestra', 'pending', 'uploads/reports/leak.jpg', 6, NULL, NULL);

-- ===================================
-- PRODUCTOS DE CANTINA
-- ===================================
INSERT INTO CanteenItems (product_name, product_price, product_enabled) VALUES 
('Entrepà de pernil', 3.50, 1),
('Entrepà vegetal', 3.20, 1),
('Entrepà de tonyina', 3.30, 1),
('Entrepà de formatge', 3.00, 1),
('Entrepà de truita', 3.40, 1),
('Croissant', 1.20, 1),
('Ensaïmada', 1.30, 1),
('Donut', 1.40, 1),
('Pizza porció', 2.20, 1),
('Pasta de xocolata', 1.80, 1),
('Aigua 50cl', 1.00, 1),
('Refresc de cola', 1.50, 1),
('Refresc de taronja', 1.50, 1),
('Refresc de llimona', 1.50, 1),
('Suc de taronja natural', 2.00, 1),
('Cafè sol', 1.10, 1),
('Cafè amb llet', 1.30, 1),
('Tallat', 1.20, 1),
('Te', 1.00, 1),
('Infusió', 1.00, 1),
('Ensalada mixta', 4.50, 1),
('Ensalada Cèsar', 5.00, 1),
('Fruita del dia', 1.00, 1),
('Iogurt natural', 1.30, 1),
('Batut de proteïnes', 2.50, 0),
('Gelat', 1.80, 0),
('Xocolata calenta', 1.40, 0),
('Plat del dia', 6.50, 1),
('Menu complet', 8.50, 1),
('Patates xips', 1.20, 1);