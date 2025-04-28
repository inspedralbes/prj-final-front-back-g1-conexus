-- Insert data into departments
INSERT INTO departments (name) VALUES 
('Informàtica'),
('Administració i Finances'),
('Màrqueting i Publicitat'),
('Comerç Internacional'),
('Desenvolupament d''Aplicacions Multiplataforma'),
('Desenvolupament d''Aplicacions Web');

-- Insert data into typesUsers
INSERT INTO typesUsers (name) VALUES 
('Estudiant'),
('Professor'),
('Cantina'),
('Técnic'),
('Administrador');

-- Insert data into users
-- Note: In a real environment, passwords should be properly hashed
-- These passwords are for example only and are set as '$2b$10$..." to simulate bcrypt hashing
INSERT INTO users (typesUsers_id, name, email, password, profile, department_id, description) VALUES
(5, 'Administrador Sistema', 'admin@conexus.edu', '$2b$10$XdAGxWoB9jRDfSn7BihZF.HqtQ0WlHAs1jYFvOgQBTYqXZInPnR2W', 'https://i.pravatar.cc/150?img=1', 1, 'Administrador principal del sistema Conexus'),
(2, 'Joan Martinez', 'jmartinez@conexus.edu', '$2b$10$IW3lkB1BRDU.RioLtVUzVeNpMcVpDTzLqBiMqftLGYcZQaePTkOxK', 'https://i.pravatar.cc/150?img=2', 5, 'Professor de desenvolupament d''aplicacions multiplataforma');