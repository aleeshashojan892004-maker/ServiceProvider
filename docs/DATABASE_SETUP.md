# 🗄️ Database Setup Guide

## Overview

The project uses **SQLite** (file-based database) for storing user data, services, and bookings. The database file is located at `backend/database.sqlite`.

---

## Quick Setup

### 1. Initialize Database (First Time)

```bash
cd backend
npm run init-db
```

This will:
- Create database file (`database.sqlite`)
- Create all tables (users, services, bookings)
- Set up relationships between tables

### 2. Reset Database (Clean Slate)

⚠️ **Warning:** This will delete all existing data!

```bash
cd backend
npm run reset-db
```

### 3. Seed Sample Services

Add sample services to the database:

```bash
cd backend
npm run seed-services
```

This adds 13 sample services including:
- AC Service & Repair
- Cleaning services
- Salon services
- Electrician & Plumber
- Painting & Carpentry

### 4. Create Test Users

Create test accounts for development:

```bash
cd backend
npm run create-test-users
```

**Test Credentials:**
- **User Account:**
  - Email: `user@test.com`
  - Password: `test123`

- **Provider Account:**
  - Email: `provider@test.com`
  - Password: `test123`
  - Business: Test Services Pvt Ltd

---

## Database Schema

### Users Table
Stores both customers and service providers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key (auto-increment) |
| `name` | STRING | User's full name |
| `email` | STRING | Email (unique, for login) |
| `password` | STRING | Hashed password (bcrypt) |
| `phone` | STRING | Contact number |
| `userType` | ENUM | 'user' or 'provider' |
| `location` | TEXT (JSON) | Address/location data |
| `profilePic` | STRING | Profile picture URL |
| **Provider Fields:** |
| `businessName` | STRING | Business/company name |
| `bio` | TEXT | Business description |
| `serviceAreas` | TEXT (JSON) | Array of service areas |
| `experience` | INTEGER | Years of experience |
| `verified` | BOOLEAN | Verification status |
| `createdAt` | DATETIME | Account creation time |
| `updatedAt` | DATETIME | Last update time |

### Services Table
Service listings created by providers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key |
| `title` | STRING | Service name |
| `category` | STRING | Service category |
| `description` | TEXT | Service description |
| `price` | DECIMAL(10,2) | Service price |
| `image` | STRING | Service image URL |
| `rating` | DECIMAL(3,1) | Average rating (0-5) |
| `reviews` | INTEGER | Number of reviews |
| `providerId` | INTEGER | Foreign key to Users |
| `isActive` | BOOLEAN | Availability status |
| `createdAt` | DATETIME | Creation timestamp |
| `updatedAt` | DATETIME | Update timestamp |

### Bookings Table
Customer bookings/orders.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key |
| `userId` | INTEGER | Foreign key to Users (Customer) |
| `serviceId` | INTEGER | Foreign key to Services |
| `providerId` | INTEGER | Foreign key to Users (Provider) |
| `bookingDate` | DATE | Scheduled date |
| `bookingTime` | STRING | Scheduled time slot |
| `address` | STRING | Service delivery address |
| `totalAmount` | DECIMAL(10,2) | Total booking amount |
| `status` | ENUM | 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled' |
| `paymentStatus` | ENUM | 'pending', 'paid', 'refunded' |
| `createdAt` | DATETIME | Booking creation time |
| `updatedAt` | DATETIME | Last update time |

---

## Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run init-db` | Initialize database (preserves existing data) |
| `npm run reset-db` | Reset database (deletes all data, recreates tables) |
| `npm run seed-services` | Add sample services to database |
| `npm run create-test-users` | Create test user and provider accounts |

---

## Database Location

- **File:** `backend/database.sqlite`
- **Type:** SQLite (file-based, no server needed)
- **Size:** Grows automatically as data is added

---

## Viewing Database

You can view the database using:

### Option 1: SQLite Browser (Recommended)
1. Download: [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open: `backend/database.sqlite`
3. Browse tables and data

### Option 2: VS Code Extension
1. Install: "SQLite Viewer" extension
2. Right-click `database.sqlite` → "Open Database"

### Option 3: Command Line
```bash
sqlite3 backend/database.sqlite
.tables          # List all tables
.schema users    # Show users table structure
SELECT * FROM users;  # View all users
```

---

## Common Operations

### Check Database Status
```bash
cd backend
node scripts/initDatabase.js
```

### Reset and Populate with Sample Data
```bash
cd backend
npm run reset-db
npm run seed-services
npm run create-test-users
```

### Backup Database
Simply copy the database file:
```bash
cp backend/database.sqlite backend/database.sqlite.backup
```

### Restore Database
```bash
cp backend/database.sqlite.backup backend/database.sqlite
```

---

## Troubleshooting

### "Database locked" Error
- Close all connections to the database
- Restart the backend server
- If persists, delete `database.sqlite` and run `npm run init-db`

### Schema Mismatch Error
If you see schema mismatch errors:
```bash
npm run reset-db
```
This will recreate the database with the latest schema.

### "Table doesn't exist" Error
Run database initialization:
```bash
npm run init-db
```

---

## Security Notes

- ⚠️ **Never commit `database.sqlite` to git** (already in `.gitignore`)
- ⚠️ **Backup database** before major operations
- ⚠️ **Passwords are hashed** using bcrypt (never stored in plain text)
- ✅ **SQLite is suitable for development** and small-to-medium applications

---

## Production Considerations

For production, consider:
- Migrating to PostgreSQL or MySQL for better performance
- Setting up regular database backups
- Using environment-specific database files
- Implementing database migrations system

---

**Database is now ready to use! 🎉**
