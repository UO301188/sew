-- 1. Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS UO301188_DB
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE UO301188_DB;

-- 2. Tablas NORMALIZADAS para categorías
CREATE TABLE IF NOT EXISTS profesiones (
    id_profesion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS generos (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT NOT NULL AUTO_INCREMENT,
    codigo_identificacion VARCHAR(12) NOT NULL UNIQUE,
    profesion INT NOT NULL,
    edad INT NOT NULL,
    genero INT NOT NULL,
    pericia_informatica TINYINT NOT NULL CHECK (pericia_informatica BETWEEN 0 AND 10),
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (profesion) REFERENCES profesiones(id_profesion)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (genero) REFERENCES generos(id_genero)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. Pruebas Usabilidad
CREATE TABLE IF NOT EXISTS pruebas_usabilidad (
    id_prueba INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    dispositivo ENUM('ordenador','tableta','telefono') NOT NULL,
    tiempo_segundos INT NOT NULL,
    completado BOOLEAN NOT NULL DEFAULT 0,
    comentarios_usuario TEXT,
    propuestas_mejora TEXT,
    valoracion INT NOT NULL CHECK(valoracion BETWEEN 0 AND 10),
    fecha_prueba TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id_prueba),
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Respuestas SUS
CREATE TABLE IF NOT EXISTS respuestas_prueba (
    id_respuesta INT NOT NULL AUTO_INCREMENT,
    id_prueba INT NOT NULL,
    pregunta_numero INT NOT NULL,
    respuesta_texto TEXT NOT NULL,
    PRIMARY KEY(id_respuesta),
    UNIQUE KEY (id_prueba,pregunta_numero),
    FOREIGN KEY(id_prueba) REFERENCES pruebas_usabilidad(id_prueba)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Observaciones asociadas a prueba
CREATE TABLE IF NOT EXISTS observaciones (
    id_observacion INT NOT NULL AUTO_INCREMENT,
    id_prueba INT NOT NULL,
    comentarios_facilitador TEXT NOT NULL,
    PRIMARY KEY(id_observacion),
    FOREIGN KEY(id_prueba) REFERENCES pruebas_usabilidad(id_prueba)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Datos iniciales
INSERT IGNORE INTO profesiones (nombre) VALUES
('Estudiante'),('Ingeniero/a'),('Profesor/a'),('Administrativo/a'),('Otro');

INSERT IGNORE INTO generos (nombre) VALUES
('Hombre'),('Mujer'),('No binario'),('Prefiero no decirlo');
