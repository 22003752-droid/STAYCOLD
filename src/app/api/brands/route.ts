import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

const readDB = () => {
  if (!fs.existsSync(dbPath)) return { brands: [] };
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.brands || []);
}

export async function POST(request: Request) {
  try {
    const { brand } = await request.json();
    const db = readDB();
    if (!db.brands.includes(brand)) {
      db.brands.push(brand);
      writeDB(db);
    }
    return NextResponse.json(db.brands);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('name');
    const db = readDB();
    db.brands = db.brands.filter((b: string) => b !== brand);
    writeDB(db);
    return NextResponse.json(db.brands);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
