const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require('axios');
const app = express();
const PORT =  process.env.PORT || 5000;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "teamfinder.db"));


// Middleware
app.use(cors({
  origin: 'https://teamfinderbycodecrushers.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // for parsing application/json

const teammates = [];

app.get("/api/teammates", (req, res) => {
  db.all("SELECT * FROM teammates", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/teammates", (req, res) => {
  const { name, email, skills, availability, preferences, password } = req.body;
  const stmt = `INSERT INTO teammates (name, email, skills, availability, preferences, password)
                VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(stmt, [name, email, skills, availability, preferences, password], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, ...req.body });
  });
});


app.post("/api/feedback", (req, res) => {
  const { email, feedback } = req.body;

  if (!feedback || typeof feedback !== "string") {
    return res.status(400).json({ message: "Feedback is required." });
  }

  const timestamp = new Date().toISOString();
  const emailValue = email || "Anonymous";

  const stmt = `INSERT INTO feedback (email, feedback, timestamp) VALUES (?, ?, ?)`;
  db.run(stmt, [emailValue, feedback, timestamp], function (err) {
    if (err) return res.status(500).json({ message: "Failed to save feedback." });
    res.json({ message: "Feedback received!" });
  });
});

app.get("/api/feedback", (req, res) => {
  db.all("SELECT * FROM feedback", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});



// POST /api/teams/:id/join
app.post("/api/teams/:id/join", (req, res) => {
  const teamId = parseInt(req.params.id);
  const { name, email, image = "", role = "Member", socials = {} } = req.body;

  // Get the existing team
  db.get("SELECT * FROM teams WHERE id = ?", [teamId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Team not found" });

    let members = [];
    try {
      members = JSON.parse(row.members || "[]");
    } catch (parseErr) {
      return res.status(500).json({ error: "Failed to parse team members" });
    }

    // Add the new member
    members.push({ name, email, image, role, socials });

    // Update team
    const stmt = `UPDATE teams SET members = ? WHERE id = ?`;
    db.run(stmt, [JSON.stringify(members), teamId], function (updateErr) {
      if (updateErr) return res.status(500).json({ error: updateErr.message });

      // Respond with the updated team
      const updatedTeam = {
        ...row,
        members,
      };
      res.json(updatedTeam);
    });
  });
});



app.get("/api/teams", (req, res) => {
  db.all("SELECT * FROM teams", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsed = rows.map(row => ({
      ...row,
      members: row.members ? JSON.parse(row.members) : [],
    }));

    res.json({ teams: parsed });
  });
});



app.post("/api/teams", (req, res) => {
  const { name, description, skills, members } = req.body;

  if (!name || !description || !skills || !members) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const stmt = db.prepare(`INSERT INTO teams (name, description, skills, members) VALUES (?, ?, ?, ?)`);

  stmt.run(name, description, skills, JSON.stringify(members), function (err) {
    if (err) {
      console.error("❌ DB insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      description,
      skills,
      members
    });
  });

  stmt.finalize();
});




app.get("/api/messages", (req, res) => {
  db.all("SELECT * FROM messages", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});



// Save message
app.post("/api/messages", (req, res) => {
  const { senderId, receiverId, text } = req.body;
  const timestamp = new Date().toISOString();
  const stmt = `INSERT INTO messages (senderId, receiverId, text, timestamp) VALUES (?, ?, ?, ?)`;
  db.run(stmt, [senderId, receiverId, text, timestamp], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, senderId, receiverId, text, timestamp });
  });
});


// POST a new teammate

// Get all posts



// Create a new post
// Create new post (FULL FORMAT)
app.post("/api/posts", (req, res) => {
  const {
    authorId,
    authorName,
    content,
    likes = [],
    dislikes = [],
    shares = 0,
  } = req.body;

  const stmt = `INSERT INTO posts (authorId, authorName, content, likes, dislikes, shares)
                VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(stmt, [
    authorId,
    authorName,
    content,
    JSON.stringify(likes),
    JSON.stringify(dislikes),
    shares
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      id: this.lastID,
      authorId,
      authorName,
      content,
      likes,
      dislikes,
      shares
    });
  });
});

// Update existing post
app.put("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    authorId,
    authorName,
    content,
    likes = [],
    dislikes = [],
    shares = 0
  } = req.body;

  db.run(
    `UPDATE posts SET 
      authorId = ?, 
      authorName = ?, 
      content = ?, 
      likes = ?, 
      dislikes = ?, 
      shares = ? 
    WHERE id = ?`,
    [
      authorId,
      authorName,
      content,
      JSON.stringify(likes),
      JSON.stringify(dislikes),
      shares,
      id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Post updated" });
    }
  );
});

// Get all posts (properly parsed)
app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsed = rows.map(row => ({
      id: row.id,
      authorId: row.authorId,
      authorName: row.authorName,
      content: row.content,
      likes: JSON.parse(row.likes || "[]"),
      dislikes: JSON.parse(row.dislikes || "[]"),
      shares: row.shares || 0
    }));

    res.json(parsed);
  });
});



// Get explore content
app.get("/api/explore", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// POST update explore data (likes/comments)
app.post('/api/explore/:id', (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;

  try {
    const posts = JSON.parse(fs.readFileSync(exploreFile, 'utf-8'));
    const index = posts.findIndex(p => p.id === parseInt(id));

    if (index === -1) return res.status(404).json({ error: 'Post not found' });

    posts[index] = updatedPost;

    fs.writeFileSync(exploreFile, JSON.stringify(posts, null, 2), 'utf-8');
    res.json({ message: 'Explore post updated' });
  } catch (err) {
    console.error('Failed to update post', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);       // ✅ get .pdf or .zip
    const name = Date.now() + ext;
    cb(null, name); // ✅ example: 1715777769147.pdf
  }
});


// Allow uploads folder to be accessed publicly



app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Add a new project
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const projectUpload = multer({ storage: projectStorage });

app.post("/api/projects", projectUpload.fields([{ name: "image" }, { name: "file" }]), (req, res) => {
  const { title, tech, github } = req.body;
  const image = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;
  const file = req.files?.file ? `/uploads/${req.files.file[0].filename}` : null;

  const stmt = `INSERT INTO projects (title, tech, github, image, file) VALUES (?, ?, ?, ?, ?)`;
  db.run(stmt, [title, tech, github, image, file], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, tech, github, image, file });
  });
});


app.get("/api/announcements", (req, res) => {
  db.all("SELECT * FROM announcements", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsed = rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      likes: row.likes ? JSON.parse(row.likes) : [],
      comments: row.comments ? JSON.parse(row.comments) : [],
      user: {
        name: row.user_name || "Anonymous",
        avatar: row.user_avatar || "/default-avatar.png"
      }
    }));

    res.json(parsed);
  });
});

app.post("/api/announcements", (req, res) => {
  const {
    title,
    description,
    tags = [],
    link = "",
    date,
    user = {},
    likes = [],
    comments = []
  } = req.body;

  const userName = user?.name || "Anonymous";
  const userAvatar = user?.avatar || "/default-avatar.png";

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const stmt = `INSERT INTO announcements 
    (title, description, tags, link, date, user_name, user_avatar, likes, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(stmt,
    [
      title,
      description,
      JSON.stringify(tags),
      link,
      date || new Date().toISOString(),
      userName,
      userAvatar,
      JSON.stringify(likes),
      JSON.stringify(comments)
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        title,
        description,
        tags,
        link,
        date,
        likes,
        comments,
        user: {
          name: userName,
          avatar: userAvatar
        }
      });
    });
});



app.put("/api/announcements/:id", (req, res) => {
  const id = req.params.id;
  const {
    title, description, tags = [], link = "",
    date, user = {}, likes = [], comments = []
  } = req.body;

  const stmt = `UPDATE announcements SET
    title = ?, description = ?, tags = ?, link = ?, date = ?,
    user_name = ?, user_avatar = ?, likes = ?, comments = ?
    WHERE id = ?`;

  db.run(stmt,
    [
      title,
      description,
      JSON.stringify(tags),
      link,
      date,
      user.name,
      user.avatar,
      JSON.stringify(likes),
      JSON.stringify(comments),
      id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Announcement updated" });
    });
});



app.get("/api/health", (req, res) => {
  res.send("Server is alive!");
});



// ✅ Serve static frontend


// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
