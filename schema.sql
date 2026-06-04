CREATE DATABASE IF NOT EXISTS staycold_db;
USE staycold_db;

-- Tabla de Categorías
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Marcas
CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Configuración de la Tienda
CREATE TABLE settings (
    id INT PRIMARY KEY DEFAULT 1,
    whatsapp_number VARCHAR(50),
    store_name VARCHAR(100),
    instagram_url VARCHAR(255),
    tiktok_url VARCHAR(255),
    facebook_url VARCHAR(255)
);

-- Tabla de Productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    ounces DECIMAL(5, 2), -- Capacidad en onzas
    category_id INT,
    brand_id INT,
    is_new BOOLEAN DEFAULT false,
    shipping_price DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);

-- Tabla de Usuarios (Administradores)
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT 'Administrador',
    role ENUM('admin', 'editor') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo iniciales
INSERT IGNORE INTO categories (name) VALUES ('Deportivos'), ('Oficina'), ('Niños');
INSERT IGNORE INTO brands (name) VALUES ('Staycold Premium'), ('Staycold Basic');
INSERT IGNORE INTO settings (id, whatsapp_number, store_name, instagram_url, tiktok_url, facebook_url) 
VALUES (1, '50200000000', 'Staycold Oficial', '', '', '');
