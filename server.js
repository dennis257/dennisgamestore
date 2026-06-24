const express = require('express');
const cors    = require('cors');
const path    = require('path');
const db      = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend files
app.use(express.static(path.join(__dirname)));

// ── GET /api/games ────────────────────────────────────────────
// Returns all games. Supports ?genre= and ?search= query params.
app.get('/api/games', (req, res) => {
  const { genre, search } = req.query;

  let query = 'SELECT * FROM games WHERE 1=1';
  const params = [];

  if (genre && genre !== 'all') {
    query += ' AND genre = ?';
    params.push(genre);
  }

  if (search) {
    query += ' AND (LOWER(title) LIKE ? OR LOWER(genre) LIKE ?)';
    const term = `%${search.toLowerCase()}%`;
    params.push(term, term);
  }

  query += ' ORDER BY id';

  const games = db.prepare(query).all(...params);

  // Convert platforms string back to array for the frontend
  const result = games.map(g => ({
    ...g,
    platforms: g.platforms.split(','),
    sale: g.sale ?? null,
    badge: g.badge ?? null,
  }));

  res.json(result);
});

// ── POST /api/orders ──────────────────────────────────────────
// Accepts { email, items: [{ id, title, cartPrice }] }
// Saves order to DB and returns a fake confirmation.
app.post('/api/orders', (req, res) => {
  const { email, items } = req.body;

  if (!email || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'email and a non-empty items array are required.' });
  }

  const total = items.reduce((sum, item) => sum + (item.cartPrice || 0), 0);

  const stmt = db.prepare(`
    INSERT INTO orders (email, total, items)
    VALUES (?, ?, ?)
  `);

  const info = stmt.run(email, total, JSON.stringify(items));

  res.status(201).json({
    success: true,
    orderId: info.lastInsertRowid,
    email,
    total: parseFloat(total.toFixed(2)),
    itemCount: items.length,
    message: 'Order placed! Your game keys will be emailed shortly.',
  });
});

// ── GET /api/orders ───────────────────────────────────────────
// List all orders (useful for testing / admin).
app.get('/api/orders', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  const result = orders.map(o => ({ ...o, items: JSON.parse(o.items) }));
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`DennisGames server running at http://localhost:${PORT}`);
});
