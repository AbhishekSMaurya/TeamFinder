// initProjectsTable.js
const pool = require('./db');

const createProjectsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        tech TEXT,
        github TEXT,
        image TEXT,
        file TEXT
      );
    `);

    console.log("✅ 'projects' table created successfully!");
  } catch (error) {
    console.error("❌ Error creating projects table:", error);
  } finally {
    pool.end();
  }
};

createProjectsTable();
