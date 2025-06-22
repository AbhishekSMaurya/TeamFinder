const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ✅ Detect if running on Render
const isRender = process.env.RENDER === "true";

// ✅ Choose DB path
const dbPath = isRender
  ? "/var/data/teamfinder.db"             // Render uses persistent volume
  : path.join(__dirname, "teamfinder.db"); // Local dev uses project folder

const db = new sqlite3.Database(dbPath);


// db.js
// db.js

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

// ✅ Seed mockContent if explore table is empty
db.get("SELECT COUNT(*) AS count FROM explore", (err, row) => {
  if (err) return console.error("❌ Failed to count explore rows:", err.message);

  if (row?.count === 0) {
    console.log("✨ Seeding mock explore content...");

    const mockContent = [
      { type: 'image', url: 'https://picsum.photos/300/300?random=1', user: 'Aarav', content: '', likes: 0, comments: [] },
      { type: 'image', url: 'https://picsum.photos/300/300?random=2', user: 'Meera', content: '', likes: 0, comments: [] },
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', user: 'Rahul', content: '', likes: 0, comments: [] },
      { type: 'text', content: 'Just finished building my first full-stack app!', user: 'Sneha', url: '', likes: 0, comments: [] },
      { type: 'image', url: 'https://picsum.photos/300/300?random=5', user: 'Dev', content: '', likes: 0, comments: [] },
      { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', user: 'Priya', content: '', likes: 0, comments: [] },
      { type: 'text', content: 'Traveling to the mountains. Peace. ☁️', user: 'Ankit', url: '', likes: 0, comments: [] },
      { type: 'image', url: 'https://picsum.photos/300/300?random=8', user: 'Tanvi', content: '', likes: 0, comments: [] },
    ];


    const stmt = db.prepare(`INSERT INTO explore (type, url, content, user, likes, comments) VALUES (?, ?, ?, ?, ?, ?)`);

    mockContent.forEach(post => {
      stmt.run(post.type, post.url, post.content, post.user, post.likes, JSON.stringify(post.comments));
    });

    stmt.finalize();
  }
});


module.exports = db;
