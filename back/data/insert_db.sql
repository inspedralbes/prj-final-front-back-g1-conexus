-- SQLBook: Code
-- Inserciones para qualifications
INSERT INTO qualifications (name) VALUES 
('Certificat de professionalitat de nivell 1'),
('Certificat acadèmic de superació del PFI'), 
('Tècnic/a en Sistemes Microinformàtics i Xarxes'), 
('Tècnic/a Superior en Administració de Sistemes Informátics en Xarxa'),
('Tècnic/a Superior en Desenvolupament d''Aplicacions Multiplataforma'),
('Tècnic/a Superior en Desenvolupament d''Aplicacions Web'),
('Tècnic/a Superior en Desenvolupament d''Aplicacions Multiplataforma');

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
INSERT INTO users (typesUsers_id, name, email, password, banner, profile, description, city, availability, verified, status, review, class_id) VALUES
(2, 'Dídac Pérez', 'didac.perez@example.com', 'didacperez', '/upload/banner_1.png', '/upload/profile_1.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Barcelona, Espanya', '[{"day":"monday", "startTime":"09:00", "endTime":"17:00"}, {"day":"tuesday", "startTime":"09:00", "endTime":"17:00"}]', true, 'approved', 4.7, 1),
(2, 'Ana María Sossa', 'ana.maria@example.com', 'anamaria', '/upload/banner_2.png', '/upload/profile_2.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Girona, Espanya', '[{"day":"monday", "startTime":"10:00", "endTime":"18:00"}, {"day":"wednesday", "startTime":"10:00", "endTime":"18:00"}]', true, 'approved', 4.8, 2),
(2, 'Vanessa Llop', 'vanessa.llop@example.com', 'vanessallop', '/upload/banner_3.png', '/upload/profile_3.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Tarragona, Espanya', '[{"day":"thursday", "startTime":"09:00", "endTime":"17:00"}, {"day":"friday", "startTime":"09:00", "endTime":"17:00"}]', true, 'approved', 4.6, 3),
(2, 'Raül Pons', 'raul.pons@example.com', 'raulpons', '/upload/banner_4.png', '/upload/profile_4.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Lleida, Espanya', '[{"day":"monday", "startTime":"08:00", "endTime":"16:00"}, {"day":"tuesday", "startTime":"08:00", "endTime":"16:00"}]', true, 'approved', 4.9, 4),
(2, 'Albert Casas', 'albert.casas@example.com', 'albertcasas', '/upload/banner_5.png', '/upload/profile_5.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Manresa, Espanya', '[{"day":"wednesday", "startTime":"10:00", "endTime":"18:00"}, {"day":"thursday", "startTime":"10:00", "endTime":"18:00"}]', true, 'approved', 4.5, 5),
(2, 'Joan Sánchez', 'joan.sanchez@example.com', 'joansanchez', '/upload/banner_6.png', '/upload/profile_6.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Reus, Espanya', '[{"day":"monday", "startTime":"09:00", "endTime":"17:00"}, {"day":"friday", "startTime":"09:00", "endTime":"17:00"}]', true, 'approved', 4.4, 6),
(2, 'Ceferino Yuste', 'ceferino.yuste@example.com', 'ceferinoyuste', '/upload/banner_7.png', '/upload/profile_7.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Mataró, Espanya', '[{"day":"tuesday", "startTime":"08:00", "endTime":"16:00"}, {"day":"thursday", "startTime":"08:00", "endTime":"16:00"}]', true, 'approved', 4.3, 7),
(2, 'Emma Morales', 'emma.morales@example.com', 'emmamorales', '/upload/banner_8.png', '/upload/profile_8.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Sabadell, Espanya', '[{"day":"monday", "startTime":"09:00", "endTime":"18:00"}, {"day":"friday", "startTime":"09:00", "endTime":"18:00"}]', true, 'approved', 4.2, 8),
(2, 'Juanjo Carrasco', 'juanjo.carrasco@example.com', 'juanjocarrasco', '/upload/banner_9.png', '/upload/profile_9.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Terrassa, Espanya', '[{"day":"tuesday", "startTime":"10:00", "endTime":"19:00"}, {"day":"wednesday", "startTime":"10:00", "endTime":"19:00"}]', true, 'approved', 4.1, 9),
(2, 'Noah Escartí', 'noah@example.com', 'noahescarti', '/upload/banner_10.png', '/upload/profile_10.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Badalona, Espanya', '[{"day":"thursday", "startTime":"08:00", "endTime":"15:00"}, {"day":"friday", "startTime":"08:00", "endTime":"15:00"}]', true, 'approved', 4.0, 10),
(2, 'Ernesto Meiras', 'ernesto.meiras@example.com', 'ernestomeiras', '/upload/banner_11.png', '/upload/profile_11.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Granollers, Espanya', '[{"day":"monday", "startTime":"09:00", "endTime":"18:00"}, {"day":"tuesday", "startTime":"09:00", "endTime":"18:00"}]', true, 'approved', 3.9, 11),
(2, 'Rafa Monje', 'rafa.monje@example.com', 'rafa.monje', '/upload/banner_12.png', '/upload/profile_12.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Vic, Espanya', '[{"day":"wednesday", "startTime":"08:00", "endTime":"16:00"}, {"day":"thursday", "startTime":"08:00", "endTime":"16:00"}]', true, 'approved', 3.8, 12),
(2, 'Segundo González', 'segundo.gonzalez@example.com', 'segundogonzalez', '/upload/banner_13.png', '/upload/profile_13.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Blanes, Espanya', '[{"day":"monday", "startTime":"10:00", "endTime":"19:00"}, {"day":"friday", "startTime":"10:00", "endTime":"19:00"}]', true, 'approved', 3.7, 13),
(2, 'Marc Aribau', 'marc.aribau@example.com', 'marcaribau', '/upload/banner_14.png', '/upload/profile_14.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Igualada, Espanya', '[{"day":"tuesday", "startTime":"09:00", "endTime":"17:00"}, {"day":"wednesday", "startTime":"09:00", "endTime":"17:00"}]', true, 'approved', 3.6, 14),
(2, 'Héctor Alonso de la Rosa', 'hector.alonso@example.com', 'hectoralonso', '/upload/banner_15.png', '/upload/profile_15.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Cerdanyola del Vallès, Espanya', '[{"day":"thursday", "startTime":"10:00", "endTime":"18:00"}, {"day":"friday", "startTime":"10:00", "endTime":"18:00"}]', true, 'approved', 3.5, 15),
(2, 'Juan Delgado', 'juan.delgado@example.com', 'juandelgado', '/upload/banner_16.png', '/upload/profile_16.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Sant Cugat del Vallès, Espanya', '[{"day":"monday", "startTime":"08:00", "endTime":"16:00"}, {"day":"wednesday", "startTime":"08:00", "endTime":"16:00"}]', true, 'approved', 3.4, 16),
(2, 'Pol Prats', 'pol.prats@example.com', 'polprats', '/upload/banner_17.png', '/upload/profile_17.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Mollet del Vallès, Espanya', '[{"day":"tuesday", "startTime":"09:00", "endTime":"18:00"}, {"day":"thursday", "startTime":"09:00", "endTime":"18:00"}]', true, 'approved', 3.3, 17),
(2, 'Gerard Torrent', 'gerard.torrent@example.com', 'gerardtorrent', '/upload/banner_18.png', '/upload/profile_18.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Vilanova i la Geltrú, Espanya', '[{"day":"monday", "startTime":"09:00", "endTime":"17:00"}, {"day":"friday", "startTime":"09:00", "endTime":"17:00"}]', true, 'approved', 3.2, 18),
(2, 'Álvaro Pérez', 'alvaro.perez@example.com', 'alvaroperez', '/upload/banner_19.png', '/upload/profile_19.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Figueres, Espanya', '[{"day":"tuesday", "startTime":"10:00", "endTime":"19:00"}, {"day":"wednesday", "startTime":"10:00", "endTime":"19:00"}]', true, 'approved', 3.1, 19),
(2, 'David Sierra', 'david.sierra@example.com', 'davidsierra', '/upload/banner_20.png', '/upload/profile_20.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'El Prat de Llobregat, Espanya', '[{"day":"thursday", "startTime":"08:00", "endTime":"15:00"}, {"day":"friday", "startTime":"08:00", "endTime":"15:00"}]', true, 'approved', 3.0, 20),
(2, 'Laura Carrillo', 'laura.carrillo@example.com', 'lauracarrillo', '/upload/banner_21.png', '/upload/profile_21.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Cornellà de Llobregat, Espanya', '[{"day":"monday", "startTime":"10:00", "endTime":"18:00"}, {"day":"tuesday", "startTime":"10:00", "endTime":"18:00"}]', true, 'approved', 2.9, 21),
(2, 'Oriol Pelino', 'oriol.pelino@example.com', 'oriolpelino', '/upload/banner_22.png', '/upload/profile_22.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Roses, Espanya', '[{"day":"wednesday", "startTime":"09:00", "endTime":"16:00"}, {"day":"friday", "startTime":"09:00", "endTime":"16:00"}]', true, 'approved', 2.8, 22),
(2, 'Marc Esteve', 'marc.esteve@example.com', 'marcesteve', '/upload/banner_23.png', '/upload/profile_23.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Vilafranca del Penedès, Espanya', '[{"day":"monday", "startTime":"08:00", "endTime":"15:00"}, {"day":"thursday", "startTime":"08:00", "endTime":"15:00"}]', true, 'approved', 2.7, 23);


-- Inserciones para users (estudiantes)
INSERT INTO users (typesUsers_id, name, email, password, banner, profile, description, city, tags, availability, verified, status, review, class_id) VALUES 
(1, 'Laura Puig', 'laura.puig@example.com', 'laurapuig', '/upload/banner_24.png', '/upload/profile_24.png', 'Sóc una persona amb moltes ganes d’aprendre i millorar les meves habilitats. M’apassiona la tecnologia i vull aprofitar aquesta oportunitat per créixer professionalment.', 'Barcelona, Espanya', '["JavaScript", "Python", "React"]', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "thursday": "9-5", "friday": "9-5"}', true, 'approved', 4.2, 19),
(1, 'Martí Vila', 'marti.vila@example.com', 'martivila', '/upload/banner_25.png', '/upload/profile_25.png', 'Estic molt interessat en el desenvolupament de programari i vull millorar les meves habilitats en aquest camp. M’agrada treballar en projectes pràctics i col·laborar amb altres persones.', 'Girona, Espanya', '["Java", "C#", "SQL"]', '{"monday": "10-6", "wednesday": "10-6", "friday": "10-6"}', true, 'approved', 3.9, 17),
(1, 'Gemma Riera', 'gemma.riera@example.com', 'gemmariera', '/upload/banner_26.png', '/upload/profile_26.png', 'M’apassiona el món de la programació i vull aprendre noves tecnologies per poder aplicar-les en projectes reals. Sóc una persona molt motivada i amb ganes de superar-me.', 'Tarragona, Espanya', '["PHP", "MySQL", "Laravel"]', '{"monday": "8-4", "tuesday": "8-4", "thursday": "8-4", "friday": "8-4"}', true, 'approved', 4.3, 24),
(1, 'Oriol Serra', 'oriol.serra@example.com', 'oriolserra', '/upload/banner_27.png', '/upload/profile_27.png', 'Sóc un apassionat de la tecnologia i vull millorar les meves habilitats en desenvolupament web. M’agrada treballar en equip i compartir coneixements amb altres persones.', 'Lleida, Espanya', '["JavaScript", "Node.js", "Express"]', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "friday": "9-5"}', true, 'approved', 4.1, 15),
(1, 'Anna Martí', 'anna.marti@example.com', 'annamarti', '/upload/banner_28.png', '/upload/profile_28.png', 'Tinc moltes ganes d’aprendre i millorar les meves habilitats en desenvolupament de programari. M’agrada treballar en projectes pràctics i col·laborar amb altres persones per assolir objectius comuns.', 'Barcelona, Espanya', '["Ruby", "Rails", "JavaScript"]', '{"monday": "10-6", "tuesday": "10-6", "wednesday": "10-6", "thursday": "10-6"}', true, 'approved', 4.4, 23),
(1, 'Pau Ferrer', 'pau.ferrer@example.com', 'pauferrer', '/upload/banner_29.png', '/upload/profile_29.png', 'M’agrada molt la programació i vull aprendre més sobre desenvolupament web i aplicacions mòbils.', 'València, Espanya', '["HTML", "CSS", "JavaScript"]', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "thursday": "9-5", "friday": "9-5"}', true, 'approved', 4.0, 20),
(1, 'Carla López', 'carla.lopez@example.com', 'carlalopez', '/upload/banner_30.png', '/upload/profile_30.png', 'Estic interessada en el disseny gràfic i vull millorar les meves habilitats en aquest camp.', 'Madrid, Espanya', '["Photoshop", "Illustrator", "InDesign"]', '{"monday": "10-6", "tuesday": "10-6", "wednesday": "10-6", "thursday": "10-6"}', true, 'approved', 4.5, 21),
(1, 'Jordi Soler', 'jordi.soler@example.com', 'jordisoler', '/upload/banner_31.png', '/upload/profile_31.png', 'M’apassiona la intel·ligència artificial i vull aprendre més sobre aquest camp.', 'Sevilla, Espanya', '["Python", "TensorFlow", "Keras"]', '{"monday": "8-4", "tuesday": "8-4", "wednesday": "8-4", "thursday": "8-4"}', true, 'approved', 4.6, 22),
(1, 'Marta Vidal', 'marta.vidal@example.com', 'martavidal', '/upload/banner_32.png', '/upload/profile_32.png', 'Vull millorar les meves habilitats en desenvolupament de videojocs i aprendre noves tècniques.', 'Bilbao, Espanya', '["Unity", "C#", "Blender"]', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "thursday": "9-5"}', true, 'approved', 4.3, 23),
(1, 'Albert Gómez', 'albert.gomez@example.com', 'albertgomez', '/upload/banner_33.png', '/upload/profile_33.png', 'M’interessa el desenvolupament de software i vull aprendre més sobre aquest camp.', 'Zaragoza, Espanya', '["Java", "Spring", "Hibernate"]', '{"monday": "10-6", "tuesday": "10-6", "wednesday": "10-6", "thursday": "10-6"}', true, 'approved', 4.2, 24);

-- Inserciones para users (administradores)
INSERT INTO users (typesUsers_id, name, email, password, banner, profile, description, city, verified, status, review, class_id) VALUES 
(3, 'Administradora A', 'adminA@example.com', 'admina', '/upload/banner_34.png', '/upload/profile_34.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Barcelona, Espanya', true, 'approved', 0.0, 1),
(3, 'Administrador B', 'adminB@example.com', 'adminb', '/upload/banner_35.png', '/upload/profile_35.png', 'Sóc un jove que busca formar-se i millorar les meves habilitats tant personals com professionals. Vaig decidir apuntar-me perquè vull aprendre d’una manera més pràctica i enfocada a una professió que m’agrada, i alhora vull preparar-me per tenir més opcions al futur, ja sigui treballant o continuant els meus estudis.
Em considero una persona amb ganes de superar-me, trobar el meu camí i aprofitar al màxim les eines que aquest curs em proporciona. Aquest programa no només m’ajuda a aprendre coses noves, sinó que també m’està motivant a creure en les meves possibilitats i a construir un futur millor.', 'Barcelona, Espanya', true, 'approved', 0.0, 1);

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
INSERT INTO comments (publication_id, user_id, commentReply_id, comment, text_ia) VALUES 
(1, 2, NULL, 'Molt informatiu!', 1), 
(2, 3, 1, 'Gràcies pels detalls.', 1), 
(3, 4, NULL, 'Gran lectura!', 1), 
(4, 5, NULL, 'Article útil.', 1), 
(5, 1, NULL, 'Ben escrit.', 1);

-- Inserciones para reportsPublications
INSERT INTO reportsPublications (publication_id, user_id, report) VALUES 
(1, 3, 'Contingut inadequat'), 
(2, 4, 'Spam'), 
(3, 5, 'Llenguatge ofensiu'), 
(4, 1, 'Plagi'), 
(5, 2, 'Informació falsa');

-- Inserciones para reportsChats
INSERT INTO reportsChats (message_id, user_id, content, report, status) VALUES 
(1, 2, 'Gilipollas', 'Llenguatge ofensiu', 'pending'), 
(2, 3, 'Soy un primo nigeriano', 'Spam', 'pending'), 
(3, 4, 'Quiero sexo', 'Contingut inadequat', 'pending'), 
(4, 5, '???', 'Informació falsa', 'pending'), 
(5, 1, 'Missatge plagiat', 'Plagi', 'pending');

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