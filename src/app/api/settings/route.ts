import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

const readDB = () => {
  if (!fs.existsSync(dbPath)) return {};
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.settings || {});
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    const db = readDB();
    db.settings = { ...db.settings, ...newSettings };
    writeDB(db);
    return NextResponse.json(db.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 });
  }
}
