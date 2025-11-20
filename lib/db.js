const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = (() => {
    const dataDir = path.join(process.cwd(), 'data');
    if (fs.existsSync(dataDir)) {
        return path.join(dataDir, 'scankart.db');
    }
    return path.join('/tmp', 'scankart.db');
})();

const db = new sqlite3.Database(dbPath);

const initDb = () => {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      student_class TEXT NOT NULL,
      school TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Items Table
        db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL DEFAULT 0,
      condition TEXT,
      category TEXT,
      image_base64 TEXT,
      seller_id INTEGER NOT NULL,
      preferred_exchange_place TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id)
    )`);

        // Admin Actions Table
        db.run(`CREATE TABLE IF NOT EXISTS admin_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      item_id INTEGER,
      action TEXT,
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Seed Data
        db.get("SELECT count(*) as count FROM users", (err, row) => {
            if (err) console.error(err);
            if (row && row.count === 0) {
                console.log("Seeding database...");
                seedData();
            }
        });
    });
};

const seedData = () => {
    const admin = { name: "Admin", phone: "9999999999", role: "admin", school: "ScanKart High", student_class: "Staff" };
    const users = [
        { name: "Alice", phone: "1111111111", role: "student", school: "Greenwood High", student_class: "10A" },
        { name: "Bob", phone: "2222222222", role: "student", school: "Greenwood High", student_class: "10B" },
        { name: "Charlie", phone: "3333333333", role: "student", school: "Valley School", student_class: "12C" },
        { name: "Diana", phone: "4444444444", role: "student", school: "Valley School", student_class: "11A" },
        { name: "Eve", phone: "5555555555", role: "student", school: "City Public", student_class: "9B" },
        { name: "Frank", phone: "6666666666", role: "student", school: "City Public", student_class: "8A" }
    ];

    const stmt = db.prepare("INSERT INTO users (name, phone, role, school, student_class) VALUES (?, ?, ?, ?, ?)");

    stmt.run(admin.name, admin.phone, admin.role, admin.school, admin.student_class);
    users.forEach(u => {
        stmt.run(u.name, u.phone, u.role, u.school, u.student_class);
    });
    stmt.finalize(() => {
        seedItems();
    });
};

const seedItems = () => {
    // Sample base64 placeholder (1x1 pixel transparent gif or similar small image)
    const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const items = [
        { name: "Math Textbook Class 10", description: "NCERT Math book, good condition", price: 150, condition: "Good", category: "book", seller_id: 2, preferred_exchange_place: "Library" },
        { name: "Physics Notes", description: "Handwritten notes for Class 12 Physics", price: 50, condition: "Fair", category: "notes", seller_id: 4, preferred_exchange_place: "Canteen" },
        { name: "Geometry Box", description: "Camlin geometry box, barely used", price: 80, condition: "Like New", category: "stationery", seller_id: 3, preferred_exchange_place: "Main Gate" },
        { name: "School Uniform Shirt", description: "Size 38, White shirt for Greenwood High", price: 200, condition: "Good", category: "uniform", seller_id: 2, preferred_exchange_place: "Reception" },
        { name: "Chemistry Lab Coat", description: "White lab coat, size M", price: 300, condition: "Like New", category: "kit", seller_id: 5, preferred_exchange_place: "Lab Block" },
        { name: "English Novel - The Alchemist", description: "Supplementary reading", price: 100, condition: "Good", category: "book", seller_id: 6, preferred_exchange_place: "Class 8A" }
    ];

    const stmt = db.prepare("INSERT INTO items (name, description, price, condition, category, image_base64, seller_id, preferred_exchange_place) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    items.forEach(i => {
        stmt.run(i.name, i.description, i.price, i.condition, i.category, placeholder, i.seller_id, i.preferred_exchange_place);
    });
    stmt.finalize();
    console.log("Seeding complete.");
};

// Initialize on load
initDb();

// Helper to run queries
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = { query, run, get };
