SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- Configuración global para todas las tablas nuevas
SET GLOBAL character_set_server = utf8mb4;
SET GLOBAL character_set_database = utf8mb4;
SET GLOBAL character_set_client = utf8mb4;
SET GLOBAL character_set_connection = utf8mb4;
SET GLOBAL character_set_results = utf8mb4;
SET GLOBAL collation_server = utf8mb4_unicode_ci;
SET GLOBAL collation_database = utf8mb4_unicode_ci;
SET GLOBAL collation_connection = utf8mb4_unicode_ci;

-- Asegurar que la base de datos use utf8mb4
ALTER DATABASE conexushub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;