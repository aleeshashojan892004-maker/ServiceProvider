# 🚀 Quick Start Guide - Running the Project

## Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

---

## 📋 Step-by-Step Commands

### First Time Setup

#### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Project

### Option 1: Run in Separate Terminal Windows (Recommended)

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
**Expected Output:**
```
✅ SQLite Database Connected Successfully!
📁 Database file: ...
✅ Database models synchronized
🚀 Server is running on http://localhost:5000
📡 API available at http://localhost:5000/api
```

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Option 2: Run Both Servers Using PowerShell (Windows)

Open PowerShell in project root and run:

#### Backend (Background)
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
```

#### Frontend (Background)
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

---

## ✅ Verify Installation

1. **Backend Health Check:**
   - Open browser: `http://localhost:5000/api/health`
   - Should show: `{"status":"OK","message":"Server is running"}`

2. **Frontend:**
   - Open browser: `http://localhost:5173`
   - Should see the landing page

---

## 🎯 Available Commands

### Backend Commands (in `backend/` directory)

| Command | Description |
|---------|-------------|
| `npm start` | Run server in production mode |
| `npm run dev` | Run server with auto-reload (nodemon) |

### Frontend Commands (in `frontend/` directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📦 Optional: Seed Database with Sample Services

If you want to populate the database with sample services:

```bash
cd backend
node scripts/seedServices.js
```

---

## 🔧 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/server.js
```

**Frontend (Port 5173):**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or Vite will auto-use next available port
```

### Dependencies Not Installed
```bash
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### Database Issues
```bash
# Delete database file to reset (in backend directory)
# Windows:
del database.sqlite

# Database will be recreated on next server start
```

---

## 🌐 Access URLs

- **Frontend Application:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health
- **API Base URL:** http://localhost:5000/api

---

## 📝 Quick Reference

### Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser:**
   - Navigate to `http://localhost:5173`

4. **Stop Servers:**
   - Press `Ctrl + C` in each terminal

---

## 🎓 First Steps After Running

1. ✅ Verify both servers are running
2. ✅ Open `http://localhost:5173` in browser
3. ✅ Click "Sign Up" to create an account
4. ✅ Login and explore the application!

---

**Note:** The backend uses SQLite database, so no additional database server setup is required. The database file (`database.sqlite`) will be created automatically in the `backend/` directory on first run.
