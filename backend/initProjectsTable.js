const pool = require("./pgdb");

async function createProjectsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      tech TEXT,
      github TEXT,
      image TEXT,
      file TEXT
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Projects table created successfully.");
  } catch (err) {
    console.error("❌ Error creating projects table:", err);
  }
}

createProjectsTable();
