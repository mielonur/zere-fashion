import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  db = await open({
    filename: path.join(process.cwd(), 'zere.db'),
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON;');
  await initDb(db);
  return db;
}

async function initDb(db: Database) {
  // A1: Создание таблиц с нормализацией и связями
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      category_id INTEGER,
      stock INTEGER DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // A1: Заполнение данными (Seed)
  const catCount = await db.get('SELECT COUNT(*) as cnt FROM categories');
  if (catCount?.cnt === 0) {
    await db.run(`INSERT INTO categories (name, slug) VALUES ('Көйлектер', 'koylekter')`);
    await db.run(`INSERT INTO categories (name, slug) VALUES ('Блузалар', 'bluzalar')`);
    await db.run(`INSERT INTO categories (name, slug) VALUES ('Шалбарлар', 'shalbalar')`);
    await db.run(`INSERT INTO categories (name, slug) VALUES ('Пальтолар', 'paltolar')`);
  }

  const prodCount = await db.get('SELECT COUNT(*) as cnt FROM products');
  if (prodCount?.cnt === 0) {
    const products = [
      { name: 'Гүлді жазғы көйлек', desc: 'Жеңіл және сәнді жазғы көйлек', price: 12500, img: '/images/dress1.jpg', cat: 1 },
      { name: 'Классикалық қара көйлек', desc: 'Кез келген іс-шараға арналған классика', price: 18900, img: '/images/dress2.jpg', cat: 1 },
      { name: 'Ақ жібек блуза', desc: 'Нәзік жібек матадан жасалған блуза', price: 9800, img: '/images/blouse1.jpg', cat: 2 },
      { name: 'Кеңсе стилі блуза', desc: 'Іскери кездесулерге арналған', price: 11200, img: '/images/blouse2.jpg', cat: 2 },
      { name: 'Терракот шалбар', desc: 'Трендтегі түс, ыңғайлы кесім', price: 14500, img: '/images/pants1.jpg', cat: 3 },
      { name: 'Тар кесімді джинс', desc: 'Күнделікті кию үшін мінсіз', price: 16700, img: '/images/pants2.jpg', cat: 3 },
      { name: 'Бежевый пальто', desc: 'Күз-Көктемге арналған элегантты пальто', price: 45000, img: '/images/coat1.jpg', cat: 4 },
      { name: 'Қысқы жылы пальто', desc: 'Қысқа арналған, жылы тон', price: 58000, img: '/images/coat2.jpg', cat: 4 },
    ];
    for (const p of products) {
      await db.run(
        `INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)`,
        [p.name, p.desc, p.price, p.img, p.cat]
      );
    }
  }
}
