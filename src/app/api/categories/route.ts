import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT name FROM categories ORDER BY name ASC');
    const categories = (rows as any[]).map((row) => row.name);
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { category } = await request.json();
    
    // Check if exists
    const [existing] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
    if ((existing as any[]).length === 0) {
      await pool.query('INSERT INTO categories (name) VALUES (?)', [category]);
    }
    
    const [rows] = await pool.query('SELECT name FROM categories ORDER BY name ASC');
    const categories = (rows as any[]).map((row) => row.name);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('name');
    
    await pool.query('DELETE FROM categories WHERE name = ?', [category]);
    
    const [rows] = await pool.query('SELECT name FROM categories ORDER BY name ASC');
    const categories = (rows as any[]).map((row) => row.name);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
