// Quick setup script to create database and admin user
const sqlite3 = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new sqlite3(dbPath);

console.log('Creating database tables...');

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
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
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

console.log('Tables created successfully!');

// Create admin user
const hashedPassword = bcrypt.hashSync('admin123', 10);

const insertUser = db.prepare('INSERT OR REPLACE INTO User (username, password, role) VALUES (?, ?, ?)');
insertUser.run('admin', hashedPassword, 'ROLE_ADMIN');

console.log('✅ Admin user created!');
console.log('Username: admin');
console.log('Password: admin123');

// Insert sample data
const insertPost = db.prepare('INSERT INTO Post (title, content, imageUrl, featured) VALUES (?, ?, ?, ?)');
insertPost.run(
    'Welcome to AdVision Studio',
    'This is the beginning of our journey. Stay tuned for more updates!',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
    1
);

const insertProject = db.prepare('INSERT INTO Project (title, description, status, imageUrl) VALUES (?, ?, ?, ?)');
insertProject.run(
    'AdVision Website',
    'The official portfolio website built with React and Node.js',
    'In Progress',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
);

console.log('✅ Sample data inserted!');
console.log('\n🚀 Database setup complete! You can now start the server with: npm run dev');

db.close();
