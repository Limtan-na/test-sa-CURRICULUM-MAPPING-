# CQI Monitoring System — Setup Guide

## Prerequisites

1. **Python 3.12+**
   - Download: https://www.python.org/downloads/
   - Check with: `python --version`

2. **MySQL** (via XAMPP or standalone)
   - XAMPP: https://www.apachefriends.org/
   - Start MySQL from XAMPP Control Panel

3. **Node.js** (for Electron desktop wrapper)
   - Required only if running as a desktop app
   - Check with: `node --version`

## Step 1: Setup Database

1. Open **XAMPP Control Panel**
2. Click **Start** for **MySQL**
3. Click **Admin** for **MySQL** (opens phpMyAdmin)
4. In phpMyAdmin, click the **SQL** tab
5. Copy the contents of `backend/sql/schema.sql`
6. Paste and click **Go**

This will:
- Create the `cqi_monitoring_system` database
- Create `users`, `programs`, `courses`, `outcomes`, `mappings` tables
- Insert 3 test accounts with sample curriculum data

## Step 2: Install Python Dependencies

Open a terminal in the `backend/` folder and run:

```bash
pip install -r requirements.txt
```

## Step 3: Run the Web App (Without Electron)

```bash
cd backend
python run.py
```

Then open your browser to: **http://localhost:5000**

## Step 4: Run with Electron (Desktop App)

```bash
cd electron
npm install
npm start
```

This will:
- Auto-start the Python Flask server on port 5000
- Open the app in a native desktop window

## Build Desktop Installer

```bash
cd electron
npx electron-builder
```

The installer will be in the `dist/` folder.

## Test Accounts

| Username | Password | Role    | Email              |
|----------|----------|---------|--------------------|
| admin    | password | ADMIN   | admin@nbsc.edu.ph  |
| manager  | password | MANAGER | manager@nbsc.edu.ph|
| user1    | password | USER    | user1@nbsc.edu.ph  |

## Project Structure

```
cqi-monitoring-system/
├── backend/
│   ├── app.py              # Flask app factory
│   ├── config.py           # Configuration (DB, secret key)
│   ├── database.py         # SQLAlchemy setup
│   ├── run.py              # Entry point
│   ├── requirements.txt    # Python dependencies
│   ├── models/             # SQLAlchemy models
│   │   ├── user.py
│   │   ├── program.py
│   │   ├── course.py
│   │   ├── outcome.py
│   │   └── mapping.py
│   ├── routes/             # Flask blueprints
│   │   ├── auth.py         # Login/logout
│   │   ├── api.py          # REST API endpoints
│   │   └── pages.py        # Page routes
│   ├── templates/          # Jinja2 HTML templates
│   ├── static/             # CSS, JS, images
│   └── sql/                # Database schema
└── electron/               # Desktop app wrapper
    ├── main.js             # Electron main process (spawns Python)
    └── package.json        # Node dependencies
```
