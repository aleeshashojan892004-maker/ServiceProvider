# Admin Signup Guide

## Admin Signup is Now Available! ✅

Admin accounts can now be created through the signup page with a security key.

## How to Sign Up as Admin

### Step 1: Get the Admin Key

The default admin key is: **`ADMIN_SECRET_KEY_2024`**

You can change this by setting an environment variable in `backend/.env`:
```env
ADMIN_REGISTRATION_KEY=your_custom_admin_key_here
```

### Step 2: Sign Up

1. Go to the **Sign Up** page: `http://localhost:5173/signup`
2. Click on the **"Admin"** tab
3. Fill in the form:
   - **Full Name**: Your name
   - **Email Address**: Your email
   - **Phone Number**: Your phone (required for admin)
   - **Admin Key**: Enter `ADMIN_SECRET_KEY_2024` (or your custom key)
   - **Password**: Choose a strong password (min 6 characters)
   - **Confirm Password**: Re-enter your password
4. Click **"Sign up as Admin"**
5. You'll be automatically redirected to the Admin Dashboard

## Security

- Admin signup requires a valid admin key
- Default key: `ADMIN_SECRET_KEY_2024`
- Change the key in `backend/.env` for production
- The key prevents unauthorized admin account creation

## Alternative: Backend Script

You can still create admin accounts using the backend script:

```bash
cd backend
npm run create-admin
```

This method doesn't require an admin key.

## Changing the Admin Key

1. Create or edit `backend/.env`:
   ```env
   ADMIN_REGISTRATION_KEY=your_secure_key_here
   ```

2. Restart the backend server

3. Use the new key when signing up as admin

## Troubleshooting

### "Invalid admin key" error
- Make sure you're using the correct admin key
- Check if `ADMIN_REGISTRATION_KEY` is set in `backend/.env`
- Default key is: `ADMIN_SECRET_KEY_2024`

### Admin signup not working
- Verify backend server is running
- Check browser console for errors
- Verify the admin key matches the backend environment variable

## Notes

- Admin accounts have full access to all user data, providers, services, and bookings
- Admin can see all passwords (hashed)
- Admin can delete users, services, and manage everything
- Use admin accounts responsibly!
