import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT name FROM brands ORDER BY name ASC');
    const brands = (rows as any[]).map((row) => row.name);
    return NextResponse.json(brands);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { brand } = await request.json();
    
    const [existing] = await pool.query('SELECT id FROM brands WHERE name = ?', [brand]);
    if ((existing as any[]).length === 0) {
      await pool.query('INSERT INTO brands (name) VALUES (?)', [brand]);
    }
    
    const [rows] = await pool.query('SELECT name FROM brands ORDER BY name ASC');
    const brands = (rows as any[]).map((row) => row.name);
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('name');
    
    await pool.query('DELETE FROM brands WHERE name = ?', [brand]);
    
    const [rows] = await pool.query('SELECT name FROM brands ORDER BY name ASC');
    const brands = (rows as any[]).map((row) => row.name);
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
