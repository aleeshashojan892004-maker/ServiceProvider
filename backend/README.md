# Service Provider Backend API

A Node.js/Express backend for the Service Provider platform (Urban Company clone).

## Features

- User authentication (JWT-based)
- User registration and login
- User profile management
- Location management
- Service listing with search and filters
- Booking management
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/serviceprovider
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Make sure MongoDB is running on your system (or use MongoDB Atlas)

4. Seed initial services data:
```bash
node scripts/seedServices.js
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/location` - Update user location

### Services
- `GET /api/services` - Get all services (with filters)
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/categories/list` - Get all categories

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
