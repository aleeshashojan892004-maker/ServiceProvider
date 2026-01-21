# 🧪 Testing Guide - Login as User and Provider Simultaneously

## Problem
The app uses localStorage to store authentication tokens, so you can only be logged in as one account at a time in the same browser.

## Solution: Use Multiple Browser Sessions

### Method 1: Regular Window + Incognito/Private Window (Easiest)

1. **Open Regular Browser Window**
   - Login as **User** (or Provider)
   - Keep this window open

2. **Open Incognito/Private Window**
   - Press `Ctrl + Shift + N` (Chrome) or `Ctrl + Shift + P` (Firefox/Edge)
   - Login as **Provider** (or User - opposite of step 1)
   - Now you have both sessions active!

**Why this works:** Incognito windows have separate localStorage, so they don't share authentication tokens.

---

### Method 2: Two Different Browsers

1. **Browser 1 (e.g., Chrome)**
   - Login as **User**
   - URL: `http://localhost:5173`

2. **Browser 2 (e.g., Edge or Firefox)**
   - Login as **Provider**
   - URL: `http://localhost:5173`

**Why this works:** Different browsers have completely separate storage.

---

### Method 3: Two Browser Profiles (Chrome)

1. **Profile 1**
   - Open Chrome with your regular profile
   - Login as **User**

2. **Profile 2**
   - Click profile icon → "Add" or "Guest"
   - Open new window with different profile
   - Login as **Provider**

---

## Recommended Testing Flow

### Step 1: Create Test Accounts

1. **Create User Account:**
   - Go to: `http://localhost:5173/signup`
   - Select "User"
   - Fill in details:
     - Name: Test User
     - Email: user@test.com
     - Password: test123
   - Click "Sign Up"

2. **Create Provider Account:**
   - Open incognito window: `http://localhost:5173/signup`
   - Select "Service Provider"
   - Fill in details:
     - Name: Test Provider
     - Email: provider@test.com
     - Password: test123
     - Business Name: Test Services
   - Click "Sign Up"

### Step 2: Test User Flow (Regular Window)

1. Login as User: `user@test.com` / `test123`
2. Browse services
3. Add services to cart
4. Create a booking
5. View orders

### Step 3: Test Provider Flow (Incognito Window)

1. Login as Provider: `provider@test.com` / `test123`
2. Go to Provider Dashboard
3. Create a service (set price, category, etc.)
4. View bookings
5. Approve/Reject the booking you created as user
6. Update booking status

---

## Quick Test Scenario

### Complete Booking Flow Test:

1. **User Window:**
   - Login as user
   - Browse services
   - Add service to cart
   - Book a service (select date/time)
   - Note the booking ID or service name

2. **Provider Window (Incognito):**
   - Login as provider
   - Go to "Bookings" tab
   - See the pending booking from user
   - Click "✓ Approve" to approve it
   - Or click "✗ Reject" to reject it
   - Update status: confirmed → in-progress → completed

3. **Back to User Window:**
   - Go to Orders page
   - See the booking status updated

---

## Tips

✅ **Keep both windows open side-by-side** for easy testing  
✅ **Use different email addresses** for user and provider accounts  
✅ **Bookmark both login pages** for quick access  
✅ **Clear localStorage** if you need to switch accounts in the same window:
   - Press F12 → Console → Type: `localStorage.clear()` → Refresh

---

## Troubleshooting

### "Already logged in" issue:
- Clear localStorage: `localStorage.clear()` in browser console
- Or use incognito window

### Can't see bookings:
- Make sure provider created a service first
- Make sure user booked that specific service
- Check that both are using the same backend (localhost:5000)

### Logout not working:
- Check browser console for errors
- Try clearing localStorage manually
- Refresh the page after logout

---

## Test Accounts Summary

| Role | Email | Password | Window Type |
|------|-------|----------|------------|
| User | user@test.com | test123 | Regular |
| Provider | provider@test.com | test123 | Incognito |

---

**Happy Testing! 🚀**
