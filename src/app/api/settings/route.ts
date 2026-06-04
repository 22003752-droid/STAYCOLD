import { NextResponse } from 'next/server';
import pool from '@/lib/db';

async function ensureSettingsTable() {
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
  
  await pool.query(`
    INSERT IGNORE INTO settings (id, whatsapp_number, store_name, instagram_url, tiktok_url, facebook_url)
    VALUES (1, '50200000000', 'Staycold Oficial', '', '', '')
  `);
}

export async function GET() {
  try {
    await ensureSettingsTable();
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    const row = (rows as any[])[0] || {};
    
    return NextResponse.json({
      whatsappNumber: row.whatsapp_number || '',
      storeName: row.store_name || '',
      instagramUrl: row.instagram_url || '',
      tiktokUrl: row.tiktok_url || '',
      facebookUrl: row.facebook_url || ''
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al leer configuración' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    await ensureSettingsTable();
    
    await pool.query(`
      UPDATE settings 
      SET whatsapp_number = ?, store_name = ?, instagram_url = ?, tiktok_url = ?, facebook_url = ?
      WHERE id = 1
    `, [
      newSettings.whatsappNumber || '',
      newSettings.storeName || '',
      newSettings.instagramUrl || '',
      newSettings.tiktokUrl || '',
      newSettings.facebookUrl || ''
    ]);
    
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    const row = (rows as any[])[0] || {};
    
    return NextResponse.json({
      whatsappNumber: row.whatsapp_number,
      storeName: row.store_name,
      instagramUrl: row.instagram_url,
      tiktokUrl: row.tiktok_url,
      facebookUrl: row.facebook_url
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 });
  }
}
