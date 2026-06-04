import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

const readDB = () => {
  if (!fs.existsSync(dbPath)) return { categories: [] };
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  const db = readDB();
  return NextResponse.json(db.categories || []);
}

export async function POST(request: Request) {
  try {
    const { category } = await request.json();
    const db = readDB();
    if (!db.categories.includes(category)) {
      db.categories.push(category);
      writeDB(db);
    }
    return NextResponse.json(db.categories);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('name');
    const db = readDB();
    db.categories = db.categories.filter((c: string) => c !== category);
    writeDB(db);
    return NextResponse.json(db.categories);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
