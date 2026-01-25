import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract provider-specific fields
    const { businessName, bio, serviceAreas, experience } = req.body;
    
    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      userType: userType || 'user'
    };

    // Add provider-specific fields if userType is provider
    if (userType === 'provider') {
      if (businessName) userData.businessName = businessName.trim();
      if (bio) userData.bio = bio.trim();
      if (serviceAreas) userData.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : [serviceAreas];
      if (experience) userData.experience = parseInt(experience) || 0;
    }

    // Admin registration requires admin key for security
    if (userType === 'admin') {
      const { adminKey } = req.body;
      const validAdminKey = process.env.ADMIN_REGISTRATION_KEY || 'ADMIN_SECRET_KEY_2024';
      
      if (!adminKey || adminKey !== validAdminKey) {
        return res.status(403).json({ 
          message: 'Invalid admin key. Admin registration requires a valid admin key.' 
        });
      }
    }

    const user = await User.create(userData);
    
    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      userType: user.userType
    }); // Debug

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Reload user to get all fields including computed ones
    const savedUser = await User.findByPk(user.id);
    
    if (!savedUser) {
      return res.status(500).json({ message: 'User created but could not be retrieved' });
    }

    // Safely handle location field (might be null or JSON string)
    let locationValue = savedUser.location;
    if (locationValue && typeof locationValue === 'string') {
      try {
        locationValue = JSON.parse(locationValue);
      } catch (e) {
        // If parsing fails, use as string
        locationValue = savedUser.location;
      }
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone || '',
        userType: savedUser.userType,
        location: locationValue,
        profilePic: savedUser.profilePic || null,
        businessName: savedUser.businessName || null,
        bio: savedUser.bio || null,
        serviceAreas: savedUser.serviceAreas || [],
        experience: savedUser.experience || 0,
        verified: savedUser.verified || false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors
    });
    
    // Handle duplicate email error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
      return res.status(400).json({ message: errorMessages });
    }
    
    // Handle database connection errors
    if (error.name === 'SequelizeConnectionError') {
      return res.status(500).json({ message: 'Database connection error. Please check if the database is initialized.' });
    }
    
    // Return detailed error for debugging
    res.status(500).json({ 
      message: error.message || 'Server error during registration', 
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Find user
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check user type if specified (allow admin to login with any type selector)
    if (userType && user.userType !== userType && user.userType !== 'admin') {
      return res.status(403).json({ message: `Access denied. Please login as ${user.userType}` });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful for user:', {
      id: user.id,
      email: user.email,
      userType: user.userType
    }); // Debug

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Reload user to ensure all fields are fresh from database
    const freshUser = await User.findByPk(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: freshUser.id,
        name: freshUser.name,
        email: freshUser.email,
        phone: freshUser.phone,
        userType: freshUser.userType,
        location: freshUser.location,
        profilePic: freshUser.profilePic,
        businessName: freshUser.businessName,
        bio: freshUser.bio,
        serviceAreas: freshUser.serviceAreas,
        experience: freshUser.experience,
        verified: freshUser.verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login', error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        location: user.location,
        profilePic: user.profilePic,
        businessName: user.businessName,
        bio: user.bio,
        serviceAreas: user.serviceAreas,
        experience: user.experience,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
