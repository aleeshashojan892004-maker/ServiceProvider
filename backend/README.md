# Service Provider Backend API

A Node.js/Express backend for the Service Provider platform.

## Features

- User authentication (JWT-based)
- User registration and login
- User profile management
- Location management
- Service listing with search and filters
- Booking management
- Cart management
- Provider dashboard
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize database:
```bash
npm run init-db
```

3. Seed sample services:
```bash
npm run seed-services
```

4. Create test users:
```bash
npm run create-test-users
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Database

- **Type:** SQLite (file-based)
- **Location:** `database.sqlite`
- **No server setup required**

## Available Scripts

- `npm start` - Run in production mode
- `npm run dev` - Run with auto-reload
- `npm run init-db` - Initialize database
- `npm run reset-db` - Reset database (⚠️ deletes all data)
- `npm run seed-services` - Add sample services
- `npm run create-test-users` - Create test accounts
- `npm run setup-team` - Complete setup (reset + seed + users)

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
- `GET /api/services/:id/availability` - Check availability

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:id` - Remove item
- `PUT /api/cart/update/:id` - Update quantity
- `DELETE /api/cart/clear` - Clear cart

### Provider
- `GET /api/provider/services` - Get provider's services
- `POST /api/provider/services` - Create service
- `PUT /api/provider/services/:id` - Update service
- `DELETE /api/provider/services/:id` - Delete service
- `GET /api/provider/bookings` - Get provider's bookings
- `PUT /api/provider/bookings/:id/status` - Update booking status
- `GET /api/provider/stats` - Get provider statistics

## Technologies

- Node.js
- Express.js
- SQLite with Sequelize ORM
- JWT for authentication
- bcryptjs for password hashing
