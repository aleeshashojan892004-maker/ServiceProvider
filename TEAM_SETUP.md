# 👥 Team Setup Guide

## Quick Setup for Teammates

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Database

```bash
cd backend
npm run reset-db
npm run seed-services
npm run create-test-users
```

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔑 Test Login Credentials

### User Account
- **Email:** `user@test.com`
- **Password:** `test123`
- **Type:** Regular User

### Provider Account
- **Email:** `provider@test.com`
- **Password:** `test123`
- **Type:** Service Provider

---

## 🌐 Access URLs

### Local Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### Network Access (For Team)
To access from other devices on the same network:

1. **Find your IP address:**
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Access from other devices:**
   - Frontend: `http://YOUR_IP:5173`
   - Backend: `http://YOUR_IP:5000`

3. **Update Frontend API URL** (if needed):
   - Edit `frontend/src/utils/api.js`
   - Change `API_BASE_URL` to your IP: `http://YOUR_IP:5000/api`

---

## 📊 Database Status

The database (`backend/database.sqlite`) includes:
- ✅ 13 sample services
- ✅ 2 test user accounts
- ✅ Ready to use immediately

---

## 🧪 Testing Flow

1. **Login as User:**
   - Email: `user@test.com`
   - Password: `test123`
   - Browse services, add to cart, create bookings

2. **Login as Provider** (use incognito window):
   - Email: `provider@test.com`
   - Password: `test123`
   - View bookings, approve/reject, manage services

---

## 🚀 Quick Start Script

Run this to set everything up:

```bash
# Windows PowerShell
cd backend
npm install
npm run reset-db
npm run seed-services
npm run create-test-users
cd ../frontend
npm install
```

Then start servers in separate terminals.

---

## 📝 Notes

- Database file: `backend/database.sqlite`
- All data persists in the database
- Cart data is stored in database (not localStorage)
- Test accounts are ready to use

---

**Ready to test! 🎉**
