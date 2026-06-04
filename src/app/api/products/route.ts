import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { inventoryEmitter } from '@/lib/eventEmitter';

// Ayudante para asegurar que las columnas necesarias existan
async function ensureProductsSchema() {
  try {
    await pool.query('ALTER TABLE products ADD COLUMN is_new BOOLEAN DEFAULT false');
  } catch (e: any) {
    // Error 1060 es Duplicate column name, lo ignoramos
    if (e.errno !== 1060) console.error('Error adding is_new column:', e);
  }
  
  try {
    await pool.query('ALTER TABLE products ADD COLUMN shipping_price DECIMAL(10,2) DEFAULT 0');
  } catch (e: any) {
    if (e.errno !== 1060) console.error('Error adding shipping_price column:', e);
  }
}

export async function GET() {
  try {
    await ensureProductsSchema();
    
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category, b.name as brand
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.id DESC
    `);
    
    const products = (rows as any[]).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      stock: p.stock,
      imageUrl: p.image_url,
      ounces: Number(p.ounces),
      category: p.category,
      brand: p.brand,
      isNew: Boolean(p.is_new),
      shippingPrice: Number(p.shipping_price)
    }));
    
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al leer productos' }, { status: 500 });
  }
}

async function getOrInsertCategory(name: string) {
  if (!name) return null;
  let [rows] = await pool.query('SELECT id FROM categories WHERE name = ?', [name]);
  if ((rows as any[]).length === 0) {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return (result as any).insertId;
  }
  return (rows as any[])[0].id;
}

async function getOrInsertBrand(name: string) {
  if (!name) return null;
  let [rows] = await pool.query('SELECT id FROM brands WHERE name = ?', [name]);
  if ((rows as any[]).length === 0) {
    const [result] = await pool.query('INSERT INTO brands (name) VALUES (?)', [name]);
    return (result as any).insertId;
  }
  return (rows as any[])[0].id;
}

export async function POST(request: Request) {
  try {
    await ensureProductsSchema();
    const product = await request.json();
    
    const categoryId = await getOrInsertCategory(product.category);
    const brandId = await getOrInsertBrand(product.brand);
    
    const [result] = await pool.query(`
      INSERT INTO products (
        name, description, price, stock, image_url, ounces, category_id, brand_id, is_new, shipping_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product.name,
      product.description || '',
      product.price || 0,
      product.stock || 0,
      product.imageUrl || '',
      product.ounces || 0,
      categoryId,
      brandId,
      product.isNew || false,
      product.shippingPrice || 0
    ]);
    
    const newProduct = { ...product, id: (result as any).insertId };
    inventoryEmitter.emit('product_added', { product: newProduct });
    
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureProductsSchema();
    const product = await request.json();
    
    if (!product.id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    
    const categoryId = await getOrInsertCategory(product.category);
    const brandId = await getOrInsertBrand(product.brand);
    
    await pool.query(`
      UPDATE products SET
        name = ?, description = ?, price = ?, stock = ?, image_url = ?, ounces = ?, 
        category_id = ?, brand_id = ?, is_new = ?, shipping_price = ?
      WHERE id = ?
    `, [
      product.name,
      product.description || '',
      product.price || 0,
      product.stock || 0,
      product.imageUrl || '',
      product.ounces || 0,
      categoryId,
      brandId,
      product.isNew || false,
      product.shippingPrice || 0,
      product.id
    ]);
    
    inventoryEmitter.emit('product_updated', { product });
    inventoryEmitter.emit('stock_updated', {
      id: product.id,
      stock: product.stock,
      name: product.name,
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    inventoryEmitter.emit('product_deleted', { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
