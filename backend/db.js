const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require('fs');
const isProduction = process.env.NODE_ENV === "production";
const dbPath = isProduction
  ? "/var/data/teamfinder.db"                    // ✅ Render uses persistent path
  : path.join(__dirname, "teamfinder.db");  

// ✅ Ensure the directory exists (for local dev)

// ✅ Connect to SQLite
const db = new sqlite3.Database(dbPath);

// db.js
// db.js
const mockContent = [
  { type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=1', user: 'Aarav', content: '', likes: 0, comments: [] },
  { type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=2', user: 'Meera', content: '', likes: 0, comments: [] },
  { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', user: 'Rahul', content: '', likes: 0, comments: [] },
  { type: 'text', content: 'Just finished building my first full-stack app!', user: 'Sneha', url: '', likes: 0, comments: [] },
  { type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=5', user: 'Dev', content: '', likes: 0, comments: [] },
  { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', user: 'Priya', content: '', likes: 0, comments: [] },
  { type: 'text', content: 'Traveling to the mountains. Peace. ☁️', user: 'Ankit', url: '', likes: 0, comments: [] },
  { type: 'image', url: 'https://source.unsplash.com/random/300x300?sig=8', user: 'Tanvi', content: '', likes: 0, comments: [] },
];

db.get("SELECT COUNT(*) as count FROM explore", (err, row) => {
  if (err) return console.error("❌ Failed to count explore rows:", err.message);
  if (row?.count === 0) {
    const stmt = db.prepare(`INSERT INTO explore (type, url, content, user, likes, comments) VALUES (?, ?, ?, ?, ?, ?)`);
    mockContent.forEach(post => {
      stmt.run(post.type, post.url, post.content, post.user, post.likes, JSON.stringify(post.comments));
    });
    stmt.finalize();
    console.log("✨ Explore content seeded.");
  }
});
db.serialize(() => {
  // Teammates Table
  db.run(`CREATE TABLE IF NOT EXISTS teammates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    skills TEXT,
    availability TEXT,
    preferences TEXT,
    password TEXT
  )`);

  // Teams Table
  db.run(`CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    skills TEXT
  )`);

  // Messages Table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId TEXT,
    receiverId TEXT,
    text TEXT,
    timestamp TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
    )`);

  db.run(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    tags TEXT,
    link TEXT,
    userId TEXT,
    userName TEXT,
    userAvatar TEXT,
    date TEXT,
    likes TEXT,
    comments TEXT
  )
`);

  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    tech TEXT,
    github TEXT,
    image TEXT,
    file TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    feedback TEXT,
    timestamp TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS explore (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  url TEXT,
  content TEXT,
  user TEXT,
  likes INTEGER DEFAULT 0,
  comments TEXT DEFAULT '[]'
  )`);





  // Add more tables for posts, projects, etc. if needed
});

module.exports = db;
