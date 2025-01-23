-- Inserciones para qualifications
INSERT INTO qualifications (name) VALUES 
('Certificat de professionalitat de nivell 1'),
('Certificat acadèmic de superació del PFI'), 
('Tècnic/a en Sistemes Microinformàtics i Xarxes'), 
('Tècnic/a Superior en Administració de Sistemes Informátics en Xarxa'),
('Tècnic/a Superior en Desenvolupament d\'Aplicacions Multiplataforma'),
('Tècnic/a Superios en Desenvolupament d\'Aplicacions Web'),
('Tècnic/a Superior en Desenvolupament d\'Aplicacions Multiplataforma i Videojocs'),
('Tècnic/a Superior en Animació 3D, Jocs i Entorns Interactius'),
('Curs d\'Especialització en Desenvolupament de Videojocs i Realitat Virtual');

-- Inserciones para typesUsers
INSERT INTO typesUsers (name) VALUES 
('Estudiant'), 
('Professor'), 
('Administrador');

-- Inserciones para typesPublications
INSERT INTO typesPublications (name) VALUES 
('Comunitat'), 
('Petició');

-- Inserciones para classes (necesarias antes de insertar usuarios que las referencian)
INSERT INTO classes (name) VALUES 
('PFI 1'), 
('PFI 2'), 
('1SMX-A1'), 
('1SMX-A2'), 
('1SMX-A3'), 
('1SMX-A4'), 
('1SMX-B1/B2'), 
('2SMX-A1'), 
('2SMX-A2'), 
('2SMX-A3 (ANG)'), 
('2SMX-B'), 
('1ASIX-B1'), 
('1ASIX-B2'), 
('2ASIX-B1'), 
('2ASIX-B2 (ANG)'), 
('1 DAM'), 
('2 DAM'), 
('1 DAW'), 
('2 DAW'), 
('1 DAMVI'), 
('2 DAMVI'), 
('1 A3D'), 
('2 A3D'), 
('CURS ESPECIALITZACIÓ');

-- Inserciones para users (profesores)
INSERT INTO users (typesUsers_id, name, email, password, banner, profile, city, availibility, verified, status, review, class_id) VALUES
(2, 'Dídac Pérez', 'didac.perez@example.com', 'didacperez', '/upload/banner_default.png', '/upload/profile_default.png', 'Barcelona, Espanya', '{"monday": "9-5", "tuesday": "9-5"}', true, 'approved', 4.7, 1),
(2, 'Ana María Sossa', 'ana.maria@example.com', 'anamaria', '/upload/banner_default.png', '/upload/profile_default.png', 'Girona, Espanya', '{"monday": "10-6", "wednesday": "10-6"}', true, 'approved', 4.8, 2),
(2, 'Vanessa Llop', 'vanessa.llop@example.com', 'vanessallop', '/upload/banner_default.png', '/upload/profile_default.png', 'Tarragona, Espanya', '{"thursday": "9-5", "friday": "9-5"}', true, 'approved', 4.6, 3),
(2, 'Raül Pons', 'raul.pons@example.com', 'raulpons', '/upload/banner_default.png', '/upload/profile_default.png', 'Lleida, Espanya', '{"monday": "8-4", "tuesday": "8-4"}', true, 'approved', 4.9, 4),
(2, 'Albert Casas', 'albert.casas@example.com', 'albertcasas', '/upload/banner_default.png', '/upload/profile_default.png', 'Manresa, Espanya', '{"wednesday": "10-6", "thursday": "10-6"}', true, 'approved', 4.5, 5),
(2, 'Joan Sánchez', 'joan.sanchez@example.com', 'joansanchez', '/upload/banner_default.png', '/upload/profile_default.png', 'Reus, Espanya', '{"monday": "9-5", "friday": "9-5"}', true, 'approved', 4.4, 6),
(2, 'Ceferino Yuste', 'ceferino.yuste@example.com', 'ceferinoyuste', '/upload/banner_default.png', '/upload/profile_default.png', 'Mataró, Espanya', '{"tuesday": "8-4", "thursday": "8-4"}', true, 'approved', 4.3, 7),
(2, 'Emma Morales', 'emma.morales@example.com', 'emmamorales', '/upload/banner_default.png', '/upload/profile_default.png', 'Sabadell, Espanya', '{"monday": "9-6", "friday": "9-6"}', true, 'approved', 4.2, 8),
(2, 'Juanjo Carrasco', 'juanjo.carrasco@example.com', 'juanjocarrasco', '/upload/banner_default.png', '/upload/profile_default.png', 'Terrassa, Espanya', '{"tuesday": "10-7", "wednesday": "10-7"}', true, 'approved', 4.1, 9),
(2, 'Noah Escartí', 'noah@example.com', 'noahescarti', '/upload/banner_default.png', '/upload/profile_default.png', 'Badalona, Espanya', '{"thursday": "8-3", "friday": "8-3"}', true, 'approved', 4.0, 10),
(2, 'Ernesto Meiras', 'ernesto.meiras@example.com', 'ernestomeiras', '/upload/banner_default.png', '/upload/profile_default.png', 'Granollers, Espanya', '{"monday": "9-6", "tuesday": "9-6"}', true, 'approved', 3.9, 11),
(2, 'Rafa Monje', 'rafa.monje@example.com', 'rafa.monje', '/upload/banner_default.png', '/upload/profile_default.png', 'Vic, Espanya', '{"wednesday": "8-4", "thursday": "8-4"}', true, 'approved', 3.8, 12),
(2, 'Segundo González', 'segundo.gonzalez@example.com', 'segundogonzalez', '/upload/banner_default.png', '/upload/profile_default.png', 'Blanes, Espanya', '{"monday": "10-7", "friday": "10-7"}', true, 'approved', 3.7, 13),
(2, 'Marc Aribau', 'marc.aribau@example.com', 'marcaribau', '/upload/banner_default.png', '/upload/profile_default.png', 'Igualada, Espanya', '{"tuesday": "9-5", "wednesday": "9-5"}', true, 'approved', 3.6, 14),
(2, 'Héctor Alonso de la Rosa', 'hector.alonso@example.com', 'hectoralonso', '/upload/banner_default.png', '/upload/profile_default.png', 'Cerdanyola del Vallès, Espanya', '{"thursday": "10-6", "friday": "10-6"}', true, 'approved', 3.5, 15),
(2, 'Juan Delgado', 'juan.delgado@example.com', 'juandelgado', '/upload/banner_default.png', '/upload/profile_default.png', 'Sant Cugat del Vallès, Espanya', '{"monday": "8-4", "wednesday": "8-4"}', true, 'approved', 3.4, 16),
(2, 'Pol Prats', 'pol.prats@example.com', 'polprats', '/upload/banner_default.png', '/upload/profile_default.png', 'Mollet del Vallès, Espanya', '{"tuesday": "9-6", "thursday": "9-6"}', true, 'approved', 3.3, 17),
(2, 'Gerard Torrent', 'gerard.torrent@example.com', 'gerardtorrent', '/upload/banner_default.png', '/upload/profile_default.png', 'Vilanova i la Geltrú, Espanya', '{"monday": "9-5", "friday": "9-5"}', true, 'approved', 3.2, 18),
(2, 'Álvaro Pérez', 'alvaro.perez@example.com', 'alvaroperez', '/upload/banner_default.png', '/upload/profile_default.png', 'Figueres, Espanya', '{"tuesday": "10-7", "wednesday": "10-7"}', true, 'approved', 3.1, 19),
(2, 'David Sierra', 'david.sierra@example.com', 'davidsierra', '/upload/banner_default.png', '/upload/profile_default.png', 'El Prat de Llobregat, Espanya', '{"thursday": "8-3", "friday": "8-3"}', true, 'approved', 3.0, 20),
(2, 'Laura Carrillo', 'laura.carrillo@example.com', 'lauracarrillo', '/upload/banner_default.png', '/upload/profile_default.png', 'Cornellà de Llobregat, Espanya', '{"monday": "10-6", "tuesday": "10-6"}', true, 'approved', 2.9, 21),
(2, 'Oriol Pelino', 'oriol.pelino@example.com', 'oriolpelino', '/upload/banner_default.png', '/upload/profile_default.png', 'Roses, Espanya', '{"wednesday": "9-4", "friday": "9-4"}', true, 'approved', 2.8, 22),
(2, 'Marc Esteve', 'marc.esteve@example.com', 'marcesteve', '/upload/banner_default.png', '/upload/profile_default.png', 'Vilafranca del Penedès, Espanya', '{"monday": "8-3", "thursday": "8-3"}', true, 'approved', 2.7, 23);

-- Inserciones para users (estudiantes)
INSERT INTO users (typesUsers_id, name, email, password, banner, profile, city, tags, availibility, verified, status, review, class_id) VALUES 
(1, 'Laura Puig', 'laura.puig@example.com', 'laurapuig', '/upload/banner_default.png', '/upload/profile_default.png', 'Barcelona, Espanya', '["JavaScript", "Python", "React"]', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "thursday": "9-5", "friday": "9-5"}', true, 'approved', 4.2, 19),
(1, 'Martí Vila', 'marti.vila@example.com', 'martivila', '/upload/banner_default.png', '/upload/profile_default.png', 'Girona, Espanya', '["Java", "C#", "SQL"]', '{"monday": "10-6", "wednesday": "10-6", "friday": "10-6"}', true, 'approved', 3.9, 17),
(1, 'Gemma Riera', 'gemma.riera@example.com', 'gemmariera', '/upload/banner_default.png', '/upload/profile_default.png', 'Tarragona, Espanya', '["PHP", "MySQL", "Laravel"]', '{"monday": "8-4", "tuesday": "8-4", "thursday": "8-4", "friday": "8-4"}', true, 'approved', 4.3, 24),
(1, 'Oriol Serra', 'oriol.serra@example.com', 'oriolserra', '/upload/banner_default.png', '/upload/profile_default.png', 'Lleida, Espanya', '["JavaScript", "Node.js", "Express"]', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "friday": "9-5"}', true, 'approved', 4.1, 15),
(1, 'Anna Martí', 'anna.marti@example.com', 'annamarti', '/upload/banner_default.png', '/upload/profile_default.png', 'Barcelona, Espanya', '["Ruby", "Rails", "JavaScript"]', '{"monday": "10-6", "tuesday": "10-6", "wednesday": "10-6", "thursday": "10-6"}', true, 'approved', 4.4, 23);

-- Inserciones para users (administradores)
INSERT INTO users (typesUsers_id, name, email, password, banner, profile, city, verified, status, review, class_id) VALUES 
(3, 'Administradora A', 'adminA@example.com', 'admina', '/upload/banner_default.png', '/upload/profile_default.png', 'Barcelona, Espanya', true, 'approved', 0.0, 1),
(3, 'Administrador B', 'adminB@example.com', 'adminb', '/upload/banner_default.png', '/upload/profile_default.png', 'Barcelona, Espanya', true, 'approved', 0.0, 1);

-- Inserciones para usersQualifications
INSERT INTO usersQualifications (user_id, qualification_id) VALUES 
(1, 1), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5);

-- Inserciones para reviews
INSERT INTO reviews (reviewed_user_id, reviewer_user_id, rating) VALUES 
(1, 2, 4.5), 
(3, 4, 3.2), 
(5, 1, 5.0), 
(2, 3, 2.8), 
(4, 5, 4.0);

-- Inserciones para publications
INSERT INTO publications (typesPublications_id, title, description, user_id, reports, text_ia, image_ia) VALUES 
(1, 'Introducció al SQL', 'Aprèn les bases del SQL.', 1, 0, 1, 1), 
(1, 'Bases de Dades Avançades', 'Endinsa\'t en la gestió de bases de dades.', 2, 0, 1, 1), 
(1, 'Tendències en Data Science', 'Últimes tendències en ciència de dades.', 3, 1, 1, 1), 
(1, 'Introducció al Machine Learning', 'Una guia per a principiants al machine learning.', 4, 0, 1, 1), 
(1, 'Ressenyes Tecnològiques', 'Ressenyes dels últims productes tecnològics.', 5, 0, 1, 1);

-- Inserciones para comments
INSERT INTO comments (publication_id, user_id, commentReply_id, comment) VALUES 
(1, 2, NULL, 'Molt informatiu!'), 
(2, 3, 1, 'Gràcies pels detalls.'), 
(3, 4, NULL, 'Gran lectura!'), 
(4, 5, NULL, 'Article útil.'), 
(5, 1, NULL, 'Ben escrit.');

-- Inserciones para reportsPublications
INSERT INTO reportsPublications (publication_id, user_id, report) VALUES 
(1, 3, 'Contingut inadequat'), 
(2, 4, 'Spam'), 
(3, 5, 'Llenguatge ofensiu'), 
(4, 1, 'Plagi'), 
(5, 2, 'Informació falsa');

-- Inserciones para reportsComments
INSERT INTO reportsComments (comment_id, user_id, report) VALUES 
(1, 3, 'Llenguatge ofensiu'), 
(2, 4, 'Spam'), 
(3, 5, 'Contingut inadequat'), 
(4, 1, 'Informació falsa'), 
(5, 2, 'Plagi');

-- Inserciones para reportsUsers
INSERT INTO reportsUsers (reported_user_id, user_id, report) VALUES 
(1, 2, 'Assetjament'), 
(3, 4, 'Conducta inapropiada'), 
(5, 1, 'Spam'), 
(2, 3, 'Comportament inadequat'), 
(4, 5, 'Abús');

-- Inserciones para teacherClasses (relaciona a los profesores con sus clases)
INSERT INTO teachersClasses (user_id, class_id) VALUES 
(1, 1), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5), 
(6, 6), 
(7, 7), 
(8, 8), 
(9, 9), 
(10, 10), 
(11, 11), 
(12, 12), 
(13, 13), 
(14, 14), 
(15, 15), 
(16, 16), 
(17, 17), 
(18, 18), 
(19, 19), 
(20, 20), 
(21, 21), 
(22, 22), 
(23, 23), 
(24, 23);