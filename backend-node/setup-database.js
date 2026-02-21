// Manual database setup for D: drive
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');

// Ensure prisma directory exists
const prismaDir = path.dirname(dbPath);
if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
}

// Create database
const db = new Database(dbPath);

console.log('Creating tables...');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'ROLE_ADMIN'
  );

  CREATE TABLE IF NOT EXISTS Post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    imageUrl TEXT,
    videoUrl TEXT,
    videoId TEXT,
    featured INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    imageUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS HomeSection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sectionName TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL
  );
`);

console.log('✅ Tables created!');

// Create admin user
const hashedPassword = bcrypt.hashSync('admin123', 10);

const stmt = db.prepare('INSERT OR REPLACE INTO User (id, username, password, role) VALUES (1, ?, ?, ?)');
stmt.run('admin', hashedPassword, 'ROLE_ADMIN');

console.log('✅ Admin user created!');
console.log('   Username: admin');
console.log('   Password: admin123');

// Insert sample post
const postStmt = db.prepare('INSERT INTO Post (title, content, imageUrl, featured) VALUES (?, ?, ?, ?)');
postStmt.run(
    'Welcome to AdVision Studio',
    'Ellam Pugazhum Iraivanukke - Creative storytelling through vision!',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
    1
);

// Insert sample project
const projectStmt = db.prepare('INSERT INTO Project (title, description, status, imageUrl) VALUES (?, ?, ?, ?)');
projectStmt.run(
    'AdVision Website',
    'The official portfolio website built with React and Node.js',
    'In Progress',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
);

console.log('✅ Sample data inserted!');
console.log('\n🚀 Database setup complete!');
console.log('Start backend with: npm run dev');

db.close();
