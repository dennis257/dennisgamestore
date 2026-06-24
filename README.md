# DennisGames

A game store with a Node.js + Express + SQLite backend and a plain HTML/CSS/JS frontend.

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or newer

---

## Run locally

**1. Clone the repo**

```bash
git clone https://github.com/dennis257/dennisgamestore.git
cd dennisgamestore
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the server**

```bash
npm start
```

**4. Open the store**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

The server also seeds the SQLite database (`store.db`) automatically on first run — no setup needed.

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/games` | Return all games. Supports `?genre=action` and `?search=dragon` query params. |
| `POST` | `/api/orders` | Place a fake order. Saves to SQLite and returns a confirmation. |
| `GET` | `/api/orders` | List all saved orders (useful for testing). |

### POST /api/orders — request body

```json
{
  "email": "player@example.com",
  "items": [
    { "id": 1, "title": "Shadow Realm", "cartPrice": 29.99 }
  ]
}
```

### POST /api/orders — response

```json
{
  "success": true,
  "orderId": 1,
  "email": "player@example.com",
  "total": 29.99,
  "itemCount": 1,
  "message": "Order placed! Your game keys will be emailed shortly."
}
```

---

## Project structure

```
dennisgamestore/
├── server.js      ← Express server + API routes
├── db.js          ← SQLite setup and seed data
├── package.json   ← Dependencies
├── index.html     ← Frontend HTML
├── style.css      ← Frontend styles
├── app.js         ← Frontend JavaScript (loads games from API)
└── store.db       ← SQLite database (auto-created, git-ignored)
```

---

## Notes

- Checkout is **fake** — no real payment is processed.
- The frontend works even without the server (opens `index.html` directly in a browser) by falling back to built-in game data.
