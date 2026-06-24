const Database = require('better-sqlite3');
const db = new Database('store.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id       INTEGER PRIMARY KEY,
    title    TEXT    NOT NULL,
    genre    TEXT    NOT NULL,
    price    REAL    NOT NULL,
    sale     REAL,
    rating   REAL    NOT NULL,
    reviews  TEXT    NOT NULL,
    platforms TEXT   NOT NULL,
    badge    TEXT,
    desc     TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    NOT NULL,
    total      REAL    NOT NULL,
    items      TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed games if table is empty
const count = db.prepare('SELECT COUNT(*) as n FROM games').get();
if (count.n === 0) {
  const insert = db.prepare(`
    INSERT INTO games (id, title, genre, price, sale, rating, reviews, platforms, badge, desc)
    VALUES (@id, @title, @genre, @price, @sale, @rating, @reviews, @platforms, @badge, @desc)
  `);

  const games = [
    { id: 1,  title: "Shadow Realm",        genre: "action",   price: 29.99, sale: null,  rating: 4.7, reviews: "8.2k",  platforms: "PC,PS5",       badge: "top",  desc: "Hack-and-slash through a brutal dark fantasy world with 60+ hours of content." },
    { id: 2,  title: "Starfall Odyssey",    genre: "rpg",      price: 49.99, sale: 34.99, rating: 4.9, reviews: "21k",   platforms: "PC,Xbox,PS5",  badge: "sale", desc: "Epic space RPG with a branching narrative and hundreds of hours of story." },
    { id: 3,  title: "Iron Fortress",       genre: "strategy", price: 24.99, sale: null,  rating: 4.5, reviews: "5.1k",  platforms: "PC",           badge: null,   desc: "Build, defend, and conquer in this sweeping grand strategy experience." },
    { id: 4,  title: "Velocity Rush",       genre: "sports",   price: 19.99, sale: null,  rating: 4.6, reviews: "14k",   platforms: "PC,PS5,Xbox",  badge: "new",  desc: "Blazing-fast arcade racing across 40 hand-crafted tracks worldwide." },
    { id: 5,  title: "Pixel Dungeon Pro",   genre: "indie",    price: 9.99,  sale: null,  rating: 4.8, reviews: "33k",   platforms: "PC",           badge: "top",  desc: "Roguelike madness with procedurally generated levels and brutal difficulty." },
    { id: 6,  title: "Dragon's Wrath",      genre: "action",   price: 39.99, sale: 27.99, rating: 4.6, reviews: "9.8k",  platforms: "PC,PS5",       badge: "sale", desc: "Slay legendary dragons and claim ancient relics in this action RPG epic." },
    { id: 7,  title: "Chrono Empire",       genre: "strategy", price: 34.99, sale: null,  rating: 4.4, reviews: "4.3k",  platforms: "PC",           badge: null,   desc: "Command armies across centuries of history in this strategic masterpiece." },
    { id: 8,  title: "Neon Streets",        genre: "action",   price: 44.99, sale: null,  rating: 4.8, reviews: "18k",   platforms: "PC,PS5,Xbox",  badge: "new",  desc: "Open-world action in a rain-soaked urban sprawl. 100+ missions." },
    { id: 9,  title: "Legends United",      genre: "sports",   price: 59.99, sale: 49.99, rating: 4.5, reviews: "29k",   platforms: "PC,PS5,Xbox",  badge: "sale", desc: "The definitive football simulation — global leagues, live rosters, deep career mode." },
    { id: 10, title: "Mystic Quest",        genre: "rpg",      price: 39.99, sale: null,  rating: 4.7, reviews: "11k",   platforms: "PC,Switch",    badge: null,   desc: "Classic JRPG with a heartfelt story, turn-based combat, and gorgeous art." },
    { id: 11, title: "Tiny World Builder",  genre: "indie",    price: 14.99, sale: null,  rating: 4.9, reviews: "7.6k",  platforms: "PC,Mac",       badge: "top",  desc: "Design, sculpt, and share miniature worlds in this serene sandbox creator." },
    { id: 12, title: "Galactic Command",    genre: "strategy", price: 44.99, sale: 29.99, rating: 4.6, reviews: "6.2k",  platforms: "PC",           badge: "sale", desc: "Real-time space strategy at breathtaking scale — build fleets, conquer galaxies." },
    { id: 99, title: "Cyber Chronicles: Ultimate Edition", genre: "rpg", price: 79.99, sale: 29.99, rating: 4.9, reviews: "12.8k", platforms: "PC,PS5,Xbox", badge: "sale", desc: "Definitive open-world RPG — all DLC and expansions included." },
  ];

  const seedAll = db.transaction(() => {
    for (const g of games) insert.run(g);
  });
  seedAll();
  console.log('Database seeded with', games.length, 'games.');
}

module.exports = db;
