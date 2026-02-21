// Direct database creation without Prisma Client
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Create a minimal SQLite database file
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const dbDir = path.dirname(dbPath);

// Ensure prisma directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create empty database file
fs.writeFileSync(dbPath, '');

console.log('✅ Database file created at:', dbPath);
console.log('\n📝 IMPORTANT: Run these commands to complete setup:');
console.log('1. npx prisma db push --force-reset');
console.log('2. node seed.js');
console.log('\n🔑 Login credentials:');
console.log('   Username: admin');
console.log('   Password: admin123');
