# 🚀 Project Commands Reference

Quick reference for all available commands in the Service Provider Platform.

---

## 📋 Quick Start Commands

### Start Development Servers

**Option 1: Separate Windows (Recommended)**
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Option 2: PowerShell Background**
```powershell
# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

---

## 🗄️ Database Commands

### Initialize Database
```bash
cd backend
npm run init-db
```

### Reset Database (⚠️ Deletes all data)
```bash
cd backend
npm run reset-db
```

### Seed Sample Services
```bash
cd backend
npm run seed-services
```

### Create Test Users
```bash
cd backend
npm run create-test-users
```

### Complete Setup (Reset + Seed)
```bash
cd backend
npm run reset-db
npm run seed-services
npm run create-test-users
```

---

## 🔧 Backend Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run server in production mode |
| `npm run dev` | Run server with auto-reload (nodemon) |
| `npm run init-db` | Initialize database tables |
| `npm run reset-db` | Reset database (drop & recreate) |
| `npm run seed-services` | Add sample services |
| `npm run create-test-users` | Create test user accounts |

---

## 🎨 Frontend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📦 Installation Commands

### First Time Setup
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🧪 Testing Commands

### Test User Account
- **Email:** `user@test.com`
- **Password:** `test123`

### Test Provider Account
- **Email:** `provider@test.com`
- **Password:** `test123`

### Test Flow
1. Start both servers
2. Login as user in regular window
3. Login as provider in incognito window
4. Test booking flow

---

## 🔍 Verification Commands

### Check if Servers are Running
```powershell
netstat -ano | Select-String ":5000|:5173"
```

### Check Database Status
```bash
cd backend
node scripts/initDatabase.js
```

### View Database (SQLite Browser)
```bash
# Download DB Browser for SQLite: https://sqlitebrowser.org/
# Open: backend/database.sqlite
```

---

## 🛠️ Maintenance Commands

### Clear Node Modules (if issues)
```bash
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Reset Everything
```bash
# Backend
cd backend
Remove-Item database.sqlite
npm run reset-db
npm run seed-services
npm run create-test-users
```

---

## 📝 Git Commands

### Check Status
```bash
git status
```

### Add All Changes
```bash
git add .
```

### Commit
```bash
git commit -m "Your message"
```

### Push
```bash
git push origin main
```

---

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

---

## ⚡ Quick Commands Cheat Sheet

```bash
# Start everything
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2

# Database setup
cd backend
npm run reset-db && npm run seed-services && npm run create-test-users

# Check servers
netstat -ano | findstr ":5000 :5173"
```

---

**For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)**
