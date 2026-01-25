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

    const user = await User.create(userData);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
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
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    
    res.status(500).json({ message: error.message || 'Server error during registration', error: error.message });
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

    // Check user type if specified
    if (userType && user.userType !== userType) {
      return res.status(403).json({ message: `Access denied. Please login as ${user.userType}` });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
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
