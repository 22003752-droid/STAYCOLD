import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { inventoryEmitter } from '@/lib/eventEmitter';

// Ruta al archivo de base de datos JSON
const dbPath = path.join(process.cwd(), 'src/lib/db.json');

const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    return { products: [], categories: [], brands: [], settings: {} };
  }
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.products || []);
  } catch {
    return NextResponse.json({ error: 'Error al leer la base de datos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    const db = readDB();
    const newProduct = { ...product, id: Date.now() };
    db.products = [...(db.products || []), newProduct];
    writeDB(db);

    // 🔴 Notificar en tiempo real a todos los clientes conectados
    inventoryEmitter.emit('product_added', { product: newProduct });

    return NextResponse.json(newProduct);
  } catch {
    return NextResponse.json({ error: 'Error al guardar el producto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const db = readDB();
    db.products = db.products.map((p: any) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    writeDB(db);

    // 🔴 Notificar en tiempo real — stock actualizado
    inventoryEmitter.emit('product_updated', { product: updatedProduct });

    // Si el stock cambió específicamente, emitir evento de stock también
    inventoryEmitter.emit('stock_updated', {
      id: updatedProduct.id,
      stock: updatedProduct.stock,
      name: updatedProduct.name,
    });

    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const db = readDB();
    db.products = db.products.filter((p: any) => p.id !== id);
    writeDB(db);

    // 🔴 Notificar en tiempo real — producto eliminado
    inventoryEmitter.emit('product_deleted', { id });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
