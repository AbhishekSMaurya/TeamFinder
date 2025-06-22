const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "teamfinder.db"));

// db.js
// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render PostgreSQL
  },
});

module.exports = pool; // ✅ not an object, just pool




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




    // Add more tables for posts, projects, etc. if needed
});

module.exports = db;
