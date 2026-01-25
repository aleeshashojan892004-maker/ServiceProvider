# Service Provider Platform (Urban Company Clone)

A full-stack service provider platform similar to Urban Company, built with React and Node.js.

## Features

### Frontend
- ✅ User and Service Provider login/registration
- ✅ Service browsing with categories
- ✅ Advanced search functionality
- ✅ Filters (price, rating, category, sort)
- ✅ Location selection and management
- ✅ User profile management
- ✅ Shopping cart
- ✅ Booking system
- ✅ Service details page
- ✅ Responsive design

### Backend
- ✅ RESTful API with Express.js
- ✅ JWT-based authentication
- ✅ SQLite database (file-based, no server needed)
- ✅ User management
- ✅ Service management
- ✅ Booking system
- ✅ Search and filter APIs

## Project Structure

```
ServiceProvider/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Seed initial data (optional - adds sample services):
```bash
node scripts/seedServices.js
```

6. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar)

## Usage

1. Start both backend and frontend servers
2. Open the frontend URL in your browser
3. Register/Login as a user or service provider
4. Browse services, use search and filters
5. Add services to cart and book them
6. Manage your profile and location

## Technologies Used

### Frontend
- React 19
- React Router
- Framer Motion (animations)
- React Icons
- React Calendar
- Vite

### Backend
- Node.js
- Express.js
- SQLite (file-based database)
- Sequelize ORM
- JWT
- bcryptjs

## API Endpoints

See `backend/README.md` for detailed API documentation.

## Notes

- No database server setup required - SQLite is file-based (database.sqlite in backend/)
- Database will be created automatically on first run
- The frontend expects the backend to run on `http://localhost:5000`
- See `QUICK_START.md` for detailed setup instructions

## Quick StartFor detailed commands and setup, see **[QUICK_START.md](./QUICK_START.md)**
