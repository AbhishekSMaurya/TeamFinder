# 🚀 TeamFinder – Full-Stack Collaboration Platform

**TeamFinder** is a full-stack collaboration app that brings developers together through announcements, posts, project sharing, and an explore feed. It’s designed to mimic platforms like LinkedIn, Devpost, and GitHub in a simplified way.

---

## 📦 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: SQLite (with mock data reseeded on deploy)
- **Deployment**: Render (Free Tier)

---

## 🎯 Features

### 🔍 Explore Feed
- Reel-style scrollable feed
- Supports text, images, and video
- Likes and comments functionality

### 📢 Announcements
- Users can share announcements with a title, description, tags, and links

### 🧑‍💻 Projects
- Upload projects with title, tech stack, GitHub link, image, and file
- File and image uploads handled via `multer`

### 🗣️ Posts
- Users can publish short posts
- Likes/dislikes/share counts supported

### 💬 Messages
- Simulated messaging between users

### 💡 Feedback
- Users can submit app feedback

---

## 🔐 Hosting Constraints

This app uses **SQLite**, which is file-based and easy to use for demos and prototyping.  
However, platforms like **Render** do not persist file storage on their free plan.  



---

## 📂 Project Structure

