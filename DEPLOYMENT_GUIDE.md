# Language App - GitHub Deployment & Setup Guide

## 📋 Prerequisites

Before you begin, make sure you have:
- Git Bash installed on your computer
- A GitHub account
- The language_app folder extracted on your computer

---

## 🚀 Part 1: Push to GitHub

### Step 1: Open Git Bash
1. Navigate to your `language_app` folder
2. Right-click inside the folder and select **"Git Bash Here"**

### Step 2: Initialize Git (if not already done)
Your app already has a `.git` folder, but to be safe, run:
```bash
git init
```

### Step 3: Configure Git (First-time setup only)
If you haven't set up Git before, configure your name and email:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Create a Repository on GitHub
1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Name it: `language_app` (or any name you prefer)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Step 5: Add All Files to Git
```bash
git add .
```

### Step 6: Create Your First Commit
```bash
git commit -m "Initial commit: Language App language learning app"
```

### Step 7: Connect to GitHub Repository
Replace `YOUR_USERNAME` with your actual GitHub username:
```bash
git remote add origin https://github.com/YOUR_USERNAME/language_app.git
```

### Step 8: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

**Note:** You may be prompted to log in to GitHub. Use your GitHub username and a **Personal Access Token** (not your password).

#### How to Create a Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name, select "repo" scope
4. Copy the token and use it as your password when pushing

---

## 💻 Part 2: Run the App Locally

### Option 1: Using Python (Simplest)

#### If you have Python 3 installed:
```bash
# Navigate to the language_app folder
cd language_app

# Start a local server
python -m http.server 8000
```

Then open your browser and go to: **http://localhost:8000**

#### If you have Python 2:
```bash
python -m SimpleHTTPServer 8000
```

### Option 2: Using Node.js

#### Install http-server globally:
```bash
npm install -g http-server
```

#### Run the server:
```bash
cd language_app
http-server -p 8000
```

Then open: **http://localhost:8000**

### Option 3: Using VS Code Live Server

1. Open the `language_app` folder in VS Code
2. Install the "Live Server" extension
3. Right-click on `index.html`
4. Select **"Open with Live Server"**

### Option 4: Direct File Opening (Limited)
Simply double-click `index.html`, but note:
- Service workers won't work
- Some PWA features may be limited
- Best to use a proper server

---

## 🌐 Part 3: Deploy to GitHub Pages (Free Hosting)

### Enable GitHub Pages:
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Your app will be live at: `https://YOUR_USERNAME.github.io/language_app/`

Wait a few minutes for deployment to complete!

---

## 📱 Part 4: Install as PWA (Progressive Web App)

Once the app is running:

### On Desktop (Chrome/Edge):
1. Open the app in your browser
2. Look for the install icon in the address bar (⊕ or computer icon)
3. Click "Install"

### On Mobile:
1. Open the app in Chrome or Safari
2. Tap the share/menu button
3. Select "Add to Home Screen"

---

## 🔄 Future Updates

When you make changes to your code:

```bash
# Add changed files
git add .

# Commit with a message
git commit -m "Describe your changes here"

# Push to GitHub
git push
```

---

## 🛠️ Troubleshooting

### Problem: "Permission denied" or "Authentication failed"
**Solution:** Use a Personal Access Token instead of your password

### Problem: "Remote origin already exists"
**Solution:** 
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/language_app.git
```

### Problem: App doesn't work offline
**Solution:** The service worker only works when served over HTTPS or localhost with a proper server

### Problem: Changes not showing on GitHub Pages
**Solution:** 
- Clear browser cache (Ctrl + Shift + R)
- Wait 5-10 minutes for GitHub Pages to rebuild
- Check the Pages deployment status in Settings → Pages

---

## 📂 Project Structure

```
language_app/
├── index.html          # Main HTML file
├── app.js              # Main JavaScript logic
├── styles.css          # Styling
├── questions.json      # Question database
├── service-worker.js   # PWA offline functionality
├── manifest.json       # PWA configuration
└── .git/              # Git repository data
```

---

## 🎯 Quick Command Reference

```bash
# Check repository status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# Clone repository (on another computer)
git clone https://github.com/YOUR_USERNAME/language_app.git
```

---

## ✨ Features of Your App

- 🌐 Multi-language support (Spanish & English)
- 📚 Grammar exercises for multiple verb tenses
- 💾 Works offline (PWA)
- 📱 Installable on mobile and desktop
- 🎨 Modern, responsive design

---

## 🎓 Next Steps

1. ✅ Push to GitHub
2. ✅ Test locally
3. ✅ Deploy to GitHub Pages
4. ✅ Install as PWA
5. 🎉 Share with friends!

---

**Need help?** Feel free to ask questions about any step in this guide!
