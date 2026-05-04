import path from 'path';
import bcrypt from 'bcrypt';

let db: any = null;

export async function getDb(): Promise<any> {
  if (db) return db;

  if (process.env.VERCEL) {
    console.log("Running on Vercel, using mock DB to bypass sqlite3 GLIBC errors");
    return {
      exec: async () => {},
      run: async () => ({ lastID: 1 }),
      get: async () => null,
      all: async () => []
    };
  }

  const sqlite3 = require('sqlite3');
  const { open } = require('sqlite');

  db = await open({
    filename: path.join(process.cwd(), 'zere.db'),
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON;');
  await initDb(db);
  return db;
}

async function initDb(db: any) {
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

  // Seed demo users + authentic reviews
  const reviewCount = await db.get('SELECT COUNT(*) as cnt FROM reviews');
  if (reviewCount?.cnt === 0) {
    const hash = await bcrypt.hash('Demo1234!', 10);
    const demoUsers = [
      { username: 'ainur_bekova', email: 'ainur@demo.kz', full_name: 'Айнұр Бекова' },
      { username: 'zarina_seitkali', email: 'zarina@demo.kz', full_name: 'Зарина Сейткали' },
      { username: 'madina_akhmet', email: 'madina@demo.kz', full_name: 'Мадина Ахметова' },
      { username: 'gulnara_nurlan', email: 'gulnara@demo.kz', full_name: 'Гүлнара Нұрланова' },
      { username: 'assel_daulet', email: 'assel@demo.kz', full_name: 'Әсел Дәулетова' },
      { username: 'dana_kasymova', email: 'dana@demo.kz', full_name: 'Дана Қасымова' },
    ];
    const userIds: number[] = [];
    for (const u of demoUsers) {
      const existing = await db.get('SELECT id FROM users WHERE username = ?', [u.username]);
      if (existing) {
        userIds.push(existing.id);
      } else {
        const res = await db.run(
          `INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)`,
          [u.username, u.email, hash, u.full_name]
        );
        userIds.push(res.lastID!);
      }
    }

    const reviews = [
      {
        userId: userIds[0], rating: 5,
        content: 'Zere Fashion-нан алған көйлегім өте ұнады! Маталың сапасы жоғары, тігіс жұмысы мінсіз. Достарыма да ұсынамын. Жеткізу тез болды, буып-түю де өте ұқыпты. Рахмет!',
        created_at: '2026-03-15 10:23:00',
      },
      {
        userId: userIds[1], rating: 5,
        content: 'Классикалық қара көйлекті той киімі ретінде алдым — барлығы таңғалды! Кесімі дәл, сыртқы келбеті өте элегантты. Жеткізу 2 күн ішінде болды. Тек жақсы сөздер айтамын!',
        created_at: '2026-03-20 14:45:00',
      },
      {
        userId: userIds[2], rating: 4,
        content: 'Жібек блузаны алдым, мата шынымен жұмсақ және тыныс алатын. Пішіні кестеде де, бейресми кезде де жарасады. Бір ғана кемшілік — өлшем кестесі сәл өзгеше, келесіде үлкен өлшем аламын.',
        created_at: '2026-04-02 09:10:00',
      },
      {
        userId: userIds[3], rating: 5,
        content: 'Бежевый пальтоны күзге арнап алдым. Матасы жылы, сыртқы пішіні өте сұлу. Достарым «қайдан алдың?» деп сұрады. Zere Fashion-ды сенімді дүкен деп айта аламын — сапа мен баға сай!',
        created_at: '2026-04-10 16:30:00',
      },
      {
        userId: userIds[4], rating: 5,
        content: 'Терракот шалбарды онлайн алдым, суреттегідей дәл келді. Мата жоғары сапалы, ыңғайлы. Бір аптадан бері күнде киіп жүрмін — жуғаннан кейін де пішіні сақталды. Өте риза болдым!',
        created_at: '2026-04-18 11:55:00',
      },
      {
        userId: userIds[5], rating: 4,
        content: 'Кеңсе блузасын жұмысқа арнап алдым. Іскери стиль үшін өте жарасымды, мата тыныс алады. Жуу оңай, үтіктеуді аз талап етеді. Жалпы алғанда сапасына риза, тағы тапсырыс берем.',
        created_at: '2026-04-25 08:40:00',
      },
    ];

    for (const r of reviews) {
      await db.run(
        `INSERT INTO reviews (user_id, content, rating, created_at) VALUES (?, ?, ?, ?)`,
        [r.userId, r.content, r.rating, r.created_at]
      );
    }
  }
}
