const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const app = express();
const PORT =  process.env.PORT || 5000;
const teamsFile = path.join(__dirname, "teams.json");
const dataFile = path.join(__dirname, "teammates.json");
const exploreFile = path.join(__dirname, "exploreData.json");
const postsFile = path.join(__dirname, "posts.json");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const messagesFilePath = path.join(__dirname, "messagesData.json");
const projectsFile = path.join(__dirname, 'projects.json');
const ANNOUNCEMENTS_FILE = path.join(__dirname, 'announcements.json');




// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

const teammates = [];

app.post("/api/teammates", (req, res) => {
  const newTeammate = req.body;

  if (!newTeammate) {
    return res.status(400).json({ error: "No teammate data provided" });
  }

  // Save to file
  const filePath = path.join(__dirname, "teammates.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    const teammates = data ? JSON.parse(data) : [];

    teammates.push(newTeammate);

    fs.writeFile(filePath, JSON.stringify(teammates, null, 2), (err) => {
      if (err) {
        console.error("❌ Error writing file:", err);
        return res.status(500).json({ error: "Could not save teammate" });
      }
      console.log("✅ Teammate saved:", newTeammate);
      res.status(201).json(newTeammate);
    });
  });
});


app.get('/api/teammates', (req, res) => {
  const filePath = path.join(__dirname, "teammates.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading teammates file:", err);
      return res.status(500).json({ error: "Could not load teammates" });
    }
    const teammates = data ? JSON.parse(data) : [];
    res.json(teammates);
  });
});

app.post("/api/feedback", (req, res) => {
  const { email, feedback } = req.body;

  if (!feedback || typeof feedback !== "string") {
    return res.status(400).json({ message: "Feedback is required." });
  }

  const feedbackData = {
    email: email || "Anonymous",
    feedback,
    timestamp: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, "feedback.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    let feedbacks = [];
    if (!err && data) {
      try {
        feedbacks = JSON.parse(data);
      } catch (e) {
        console.error("Error parsing feedback.json", e);
      }
    }

    feedbacks.push(feedbackData);

    fs.writeFile(filePath, JSON.stringify(feedbacks, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing feedback.json", writeErr);
        return res.status(500).json({ message: "Failed to save feedback." });
      }
      res.json({ message: "Feedback received!" });
    });
  });
});



// POST /api/teams/:id/join
app.post('/api/teams/:id/join', (req, res) => {
  const teamId = parseInt(req.params.id);
  const  member  = req.body;

  if (!member || !member.name || !member.email) {
    return res.status(400).json({ error: "Invalid member data" });
  }

  // Load the teams data
  let raw = fs.readFileSync('teams.json', 'utf-8');
  let data = JSON.parse(raw);
  let teams = Array.isArray(data) ? data : data.teams;

  if (!teams) return res.status(500).send("Invalid teams structure");

  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).send("Team not found");

  if (!team.members) team.members = [];
  if (!member || !member.name || !member.email) {
    return res.status(400).send("Invalid member data");
  }  
  const alreadyMember = team.members.some(m => m.email === member.email);
  if (alreadyMember) {
    return res.status(400).send("User already in team");
  }

  team.members.push(member);

  fs.writeFileSync('teams.json', JSON.stringify(Array.isArray(data) ? teams : { teams }, null, 2));
  res.json(team);
});



app.get('/api/teams', (req, res) => {
  fs.readFile("teams.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load teams" });
    }
  
    try {
      const parsed = JSON.parse(data);
  
      // CASE A: if parsed is already { teams: [...] }
      if (parsed.teams && Array.isArray(parsed.teams)) {
        res.json(parsed); // ✅ just send it as-is
      }
      // CASE B: if parsed is just an array
      else if (Array.isArray(parsed)) {
        res.json({ teams }); // ✅ wrap it properly
      }
      else {
        res.status(500).json({ error: "Invalid teams structure" });
      }
  
    } catch (e) {
      res.status(500).json({ error: "Failed to parse teams file" });
    }
  });
  
});

app.post('/api/teams', (req, res) => {
  const newTeam = req.body;

  // Read the latest data from the file
  fs.readFile('./teams.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read teams.json', err);
      return res.status(500).send('Server error');
    }

    let jsonData = JSON.parse(data);
    jsonData.teams.push(newTeam);

    fs.writeFile('./teams.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to teams.json', err);
        res.status(500).send('Failed to save team');
      } else {
        res.status(201).send('Team added successfully');
      }
    });
  });
});
app.get("/api/messages", (req, res) => {
  fs.readFile(messagesFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading messages file:", err);
      return res.status(500).json({ error: "Failed to read messages" });
    }

    try {
      const messages = JSON.parse(data);
      res.json(messages);
    } catch (parseError) {
      res.status(500).json({ error: "Invalid JSON format in messages file" });
    }
  });
});


// Save message
app.post("/api/messages", (req, res) => {
  const newMsg = req.body;

  if (!newMsg.senderId || !newMsg.receiverId || !newMsg.text) {
    return res.status(400).json({ error: "Invalid message data" });
  }

  const filePath = path.join(__dirname, "messagesData.json");
  let messages = [];

  try {
    if (fs.existsSync(filePath)) {
      messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to read messagesData.json", err);
    return res.status(500).json({ error: "Failed to read messages." });
  }

  messages.push(newMsg);

  fs.writeFile(filePath, JSON.stringify(messages, null, 2), (err) => {
    if (err) {
      console.error("Failed to write to messagesData.json", err);
      return res.status(500).json({ error: "Failed to save message." });
    }

    res.status(201).json(newMsg);
  });
});



// POST a new teammate


// Get all posts
app.get("/api/posts", (req, res) => {
  const data = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  res.json(data);
});

// Create a new post
app.post("/api/posts", (req, res) => {
  const newPost = req.body;
  const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
  newPost.id = id;
  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json(newPost);
});

// Update existing post
app.put("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updated = req.body;
  let posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  posts = posts.map(p => (p.id === id ? updated : p));
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json({ message: "Post updated" });
});

// Get explore content
app.get('/api/explore', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(exploreFile, 'utf-8'));
    res.json(data);
  } catch (err) {
    console.error("Error reading exploreData.json:", err);
    res.status(500).json({ error: "Failed to load explore data." });
  }
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
  try {
    const data = JSON.parse(fs.readFileSync(projectsFile, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error("Error reading projects.json:", err);
    res.status(500).json({ error: "Failed to load projects." });
  }
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
  try {
    const projects = JSON.parse(fs.readFileSync("./projects.json", "utf-8"));

    const newProject = {
      id: Date.now(),
      title: req.body.title,
      tech: req.body.tech,
      github: req.body.github,
      image: req.files?.image ? `/uploads/${req.files.image[0].filename}` : null,
      file: req.files?.file ? `/uploads/${req.files.file[0].filename}` : null,
    };

    projects.unshift(newProject);

    fs.writeFileSync("./projects.json", JSON.stringify(projects, null, 2), "utf-8");

    res.status(201).json(newProject);
  } catch (err) {
    console.error("Failed to save project:", err);
    res.status(500).json({ error: "Failed to save project" });
  }
});

app.get("/api/announcements", (req, res) => {
  fs.readFile(ANNOUNCEMENTS_FILE, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading announcements file:", err);
      return res.status(500).json({ error: "Failed to load announcements." });
    }
    try {
      const announcements = JSON.parse(data);
      res.json(announcements);
    } catch (parseErr) {
      console.error("Error parsing announcements JSON:", parseErr);
      res.status(500).json({ error: "Corrupted announcements data." });
    }
  });
});
// POST new announcement
app.post('/api/announcements', (req, res) => {
  const newAnnouncement = req.body;

  fs.readFile(ANNOUNCEMENTS_FILE, 'utf8', (err, data) => {
    let announcements = [];

    if (!err && data) {
      try {
        announcements = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
      }
    }

    announcements.push(newAnnouncement);

    fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return res.status(500).json({ success: false, message: "Failed to save announcement." });
      }
      res.json({ success: true, message: "Announcement saved." });
    });
  });
});
app.put('/api/announcements/:id', (req, res) => {
  const updatedAnnouncement = req.body;
  const id = Number(req.params.id);

  fs.readFile(ANNOUNCEMENTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read file' });

    let announcements = [];
    try {
      announcements = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Failed to parse file' });
    }

    const index = announcements.findIndex(a => Number(a.id) === Number(id));
    if (index === -1) return res.status(404).json({ error: 'Announcement not found' });

    announcements[index] = updatedAnnouncement;

    fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to write file' });
      res.json({ success: true, message: 'Announcement updated' });
    });
  });
});


app.get("/api/health", (req, res) => {
  res.send("Server is alive!");
});



// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, "build")));

// ✅ Catch-all route for React frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
