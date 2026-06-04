import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 1. Crear tabla Categories
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Crear tabla Brands
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brands (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Crear tabla Settings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
          id INT PRIMARY KEY DEFAULT 1,
          whatsapp_number VARCHAR(50),
          store_name VARCHAR(100),
          instagram_url VARCHAR(255),
          tiktok_url VARCHAR(255),
          facebook_url VARCHAR(255)
      )
    `);

    // 4. Crear tabla Products
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          stock INT NOT NULL DEFAULT 0,
          image_url VARCHAR(500),
          ounces DECIMAL(5, 2),
          category_id INT,
          brand_id INT,
          is_new BOOLEAN DEFAULT false,
          shipping_price DECIMAL(10, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
      )
    `);

    // 5. Crear tabla Admins
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(100) DEFAULT 'Administrador',
          role ENUM('admin', 'editor') DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Insertar datos por defecto
    await pool.query(`INSERT IGNORE INTO categories (name) VALUES ('Deportivos'), ('Oficina'), ('Niños')`);
    await pool.query(`INSERT IGNORE INTO brands (name) VALUES ('Staycold Premium'), ('Staycold Basic')`);
    await pool.query(`
      INSERT IGNORE INTO settings (id, whatsapp_number, store_name, instagram_url, tiktok_url, facebook_url) 
      VALUES (1, '50200000000', 'Staycold Oficial', '', '', '')
    `);

    return NextResponse.json({ success: true, message: 'Base de datos inicializada correctamente.' });
  } catch (error: any) {
    console.error('Error inicializando BD:', error);
    return NextResponse.json({ error: 'Error inicializando la base de datos', details: error.message }, { status: 500 });
  }
}
