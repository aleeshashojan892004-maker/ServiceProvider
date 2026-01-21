import express from 'express';
import { Op } from 'sequelize';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, location, profilePic, businessName, bio, serviceAreas, experience } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update common fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location) user.location = location;
    if (profilePic !== undefined) user.profilePic = profilePic;

    // Update provider-specific fields if user is a provider
    if (user.userType === 'provider') {
      if (businessName !== undefined) user.businessName = businessName;
      if (bio !== undefined) user.bio = bio;
      if (serviceAreas !== undefined) {
        user.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : (serviceAreas ? [serviceAreas] : []);
      }
      if (experience !== undefined) user.experience = parseInt(experience) || 0;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
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
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update location
router.put('/location', authenticateToken, async (req, res) => {
  try {
    const { address, city, state, pincode, coordinates } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentLocation = user.location || {};
    user.location = {
      address: address || currentLocation.address || '',
      city: city || currentLocation.city || '',
      state: state || currentLocation.state || '',
      pincode: pincode || currentLocation.pincode || '',
      coordinates: coordinates || currentLocation.coordinates || {}
    };

    await user.save();

    res.json({
      message: 'Location updated successfully',
      location: user.location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
