import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the inventory database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL,
    price REAL NOT NULL,
    supplier TEXT NOT NULL
  )`);

  const products = [
    {
      id: 'p1',
      name: 'Classic T-Shirt',
      category: 'Apparel',
      stock: 120,
      price: 25.99,
      supplier: 'Supplier A',
    },
    {
      id: 'p2',
      name: 'Running Shoes',
      category: 'Footwear',
      stock: 75,
      price: 89.99,
      supplier: 'Supplier B',
    },
    {
      id: 'p3',
      name: 'Leather Wallet',
      category: 'Accessories',
      stock: 200,
      price: 49.99,
      supplier: 'Supplier A',
    },
    {
      id: 'p4',
      name: 'Denim Jeans',
      category: 'Apparel',
      stock: 90,
      price: 75.0,
      supplier: 'Supplier C',
    },
    {
      id: 'p5',
      name: 'Smartwatch',
      category: 'Electronics',
      stock: 50,
      price: 249.99,
      supplier: 'Supplier D',
    },
  ];

  const stmt = db.prepare("INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?, ?)");
  for (const product of products) {
    stmt.run(product.id, product.name, product.category, product.stock, product.price, product.supplier);
  }
  stmt.finalize();

  db.run(`CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId TEXT NOT NULL,
    date TEXT NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (productId) REFERENCES products (id)
  )`);
});

export default db;
