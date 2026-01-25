# Admin Setup Guide

## Creating an Admin Account

### Method 1: Using the Script (Recommended)

```bash
cd backend
npm run create-admin
```

Follow the prompts to enter:
- Admin name
- Admin email
- Admin password

### Method 2: Manual Database Entry

If you need to create an admin manually, you can use SQLite:

```bash
cd backend
sqlite3 database.sqlite
```

Then run:
```sql
INSERT INTO users (name, email, password, userType, createdAt, updatedAt)
VALUES ('Admin User', 'admin@example.com', '<hashed_password>', 'admin', datetime('now'), datetime('now'));
```

**Note:** You'll need to hash the password using bcrypt. Use the script instead.

## Login as Admin

1. Go to the login page: `http://localhost:5173/login`
2. Click on the **"Admin"** tab
3. Enter your admin email and password
4. You should be automatically redirected to `/admin/dashboard`

## Admin Features

Once logged in as admin, you can:

- **Dashboard**: View overall statistics
- **Users**: View all users with passwords, delete users
- **Providers**: View all service providers, verify/unverify them
- **Services**: View all services, delete services
- **Bookings**: View all bookings, update booking status

## Troubleshooting

### Admin is logged in as user

If you're logged in but see the user interface instead of admin dashboard:

1. **Check userType in database:**
   ```bash
   cd backend
   sqlite3 database.sqlite
   SELECT id, name, email, userType FROM users WHERE email = 'your-admin-email@example.com';
   ```
   Should show `userType = 'admin'`

2. **Clear browser cache and localStorage:**
   - Open browser DevTools (F12)
   - Go to Application tab
   - Clear Local Storage
   - Refresh the page

3. **Check browser console:**
   - Look for any errors
   - Check if `user.userType` is being set correctly

4. **Verify token:**
   - Check if the JWT token contains `userType: 'admin'`
   - In DevTools Console, run:
     ```javascript
     const token = localStorage.getItem('token');
     const payload = JSON.parse(atob(token.split('.')[1]));
     console.log('UserType in token:', payload.userType);
     ```

### Admin dashboard shows "Access denied"

1. Make sure you're logged in with an admin account
2. Check the backend logs for authentication errors
3. Verify the admin middleware is working:
   ```bash
   # Check backend/routes/admin.js has isAdmin middleware
   ```

## Test Admin Account

After running `npm run create-admin`, you can test with:
- Email: (the email you entered)
- Password: (the password you entered)
- User Type: Select "Admin" tab on login page

## Security Notes

- Admin passwords are hashed in the database (bcrypt)
- Admin routes are protected with `isAdmin` middleware
- Only users with `userType: 'admin'` can access admin routes
- Admin can see all user passwords (hashed) in the dashboard
