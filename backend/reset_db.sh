#!/bin/bash

echo "🧹 Deleting old database file..."
rm -f teamfinder.db

echo "🔁 Restarting server to recreate tables from db.js..."
node Server.js &

echo "⏳ Waiting for server to initialize..."
sleep 3

echo "🔍 Checking tables..."
sqlite3 teamfinder.db ".tables"

echo "✅ Done. You should see: teammates, teams, messages, posts, projects, announcements, feedback"
