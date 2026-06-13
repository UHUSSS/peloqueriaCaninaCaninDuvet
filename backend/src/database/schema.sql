-- =============================================
-- Schema MySQL - CRM Peluquería Canina
-- Ejecutar en XAMPP phpMyAdmin o MySQL CLI
-- =============================================

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS peluqueria_canina
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE peluqueria_canina;

-- =============================================
-- Tabla: owners (Propietarios)
-- =============================================
CREATE TABLE IF NOT EXISTS owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Tabla: pets (Mascotas)
-- =============================================
CREATE TABLE IF NOT EXISTS pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  species ENUM('perro', 'gato', 'otro') DEFAULT 'perro',
  breed VARCHAR(100),
  weight DECIMAL(5,2),
  color VARCHAR(80),
  size ENUM('pequeño', 'mediano', 'grande', 'gigante') DEFAULT 'mediano',
  gender ENUM('macho', 'hembra') DEFAULT 'macho',
  age INT,
  behavior VARCHAR(200),
  alerts TEXT COMMENT 'Alergias y notas críticas de seguridad',
  photo LONGTEXT COMMENT 'Foto de perfil en base64',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

-- =============================================
-- Tabla: stylists (Estilistas / Peluqueros)
-- =============================================
CREATE TABLE IF NOT EXISTS stylists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Tabla: appointments (Citas / Servicios)
-- =============================================
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id INT NOT NULL,
  stylist_id INT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('pendiente', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente',
  before_image LONGTEXT COMMENT 'Foto ANTES del servicio en base64',
  after_image LONGTEXT COMMENT 'Foto DESPUÉS del servicio en base64',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (stylist_id) REFERENCES stylists(id) ON DELETE SET NULL
);

-- =============================================
-- Tabla: users (Usuarios del sistema)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Índices para performance
-- =============================================
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_pets_owner ON pets(owner_id);

-- =============================================
-- Datos de ejemplo (Seed inicial)
-- =============================================

INSERT INTO users (name, email, password, role) VALUES
  ('Administrador', 'admin@peluqueria.com', '$2b$10$u8dXcUzFRPr87Ptcv0eko.ymEyOkA3xrMfq6KokGPKkYVMnCVQJ52', 'admin');
