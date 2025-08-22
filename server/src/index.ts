import express from 'express';
import cors from 'cors';
import db from './database';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulate sales every 5 seconds
setInterval(() => {
  db.get('SELECT * FROM products ORDER BY RANDOM() LIMIT 1', (err, product: Product) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (product && product.stock > 0) {
      const amount = Math.floor(Math.random() * 5) + 1;
      const newStock = product.stock - amount > 0 ? product.stock - amount : 0;

      db.run('UPDATE products SET stock = ? WHERE id = ?', [newStock, product.id]);
      db.run('INSERT INTO sales (productId, date, amount) VALUES (?, ?, ?)', [
        product.id,
        new Date().toISOString().split('T')[0],
        amount,
      ]);
      console.log(`Sold some ${product.name}. New stock: ${newStock}`);
    }
  });
}, 5000);

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the AI Inventory API!' });
});

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows: Product[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/sales', (req, res) => {
  db.all('SELECT * FROM sales', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/forecast/:productId', (req, res) => {
  const { productId } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product: Product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const forecast = [];
    let lastSale = product.stock / 30 + Math.random() * 5;
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const sales = Math.max(0, lastSale + (Math.random() * 4 - 2)); // Fluctuate sales
      forecast.push({ date: date.toISOString().split('T')[0], sales: Math.round(sales) });
      lastSale = sales;
    }

    res.json(forecast);
  });
});

app.get('/api/alerts', (req, res) => {
  db.all('SELECT * FROM products', (err, products: Product[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const alerts = [];
    for (const product of products) {
      let lastSale = product.stock / 30 + Math.random() * 5;
      let totalForecastedSales = 0;
      for (let i = 0; i < 30; i++) {
        const sales = Math.max(0, lastSale + (Math.random() * 4 - 2));
        totalForecastedSales += sales;
        lastSale = sales;
      }

      if (product.stock < totalForecastedSales * 1.5) {
        alerts.push({ ...product, forecastedSales: Math.round(totalForecastedSales) });
      }
    }
    res.json(alerts);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
