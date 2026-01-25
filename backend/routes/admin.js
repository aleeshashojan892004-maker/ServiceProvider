import express from 'express';
import { Op } from 'sequelize';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { userType: 'user' } });
    const totalProviders = await User.count({ where: { userType: 'provider' } });
    const totalServices = await Service.count();
    const totalBookings = await Booking.count();
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const completedBookings = await Booking.count({ where: { status: 'completed' } });
    const verifiedProviders = await User.count({ where: { userType: 'provider', verified: true } });

    res.json({
      stats: {
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        pendingBookings,
        completedBookings,
        verifiedProviders
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', userType = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (userType) {
      where.userType = userType;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      // Admin can see passwords - don't exclude it
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      // Admin can see passwords - don't exclude it
      include: [
        {
          model: Booking,
          as: 'bookings',
          include: [{ model: Service, as: 'service' }]
        },
        {
          model: Service,
          as: 'services'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, phone, userType, verified, businessName, bio, experience, serviceAreas } = req.body;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone !== undefined) user.phone = phone;
    if (userType) user.userType = userType;
    if (verified !== undefined) user.verified = verified;
    if (businessName !== undefined) user.businessName = businessName;
    if (bio !== undefined) user.bio = bio;
    if (experience !== undefined) user.experience = experience;
    if (serviceAreas !== undefined) user.serviceAreas = serviceAreas;

    await user.save();

    const updatedUser = await User.findByPk(user.id);
    // Admin can see passwords - don't exclude it

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.userType === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all providers
router.get('/providers', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', verified = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { userType: 'provider' };
    if (verified !== '') {
      where.verified = verified === 'true';
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { businessName: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      // Admin can see passwords - don't exclude it
      include: [
        {
          model: Service,
          as: 'services'
        },
        {
          model: Booking,
          as: 'bookings',
          include: [{ model: Service, as: 'service' }]
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      providers: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify/Unverify provider
router.put('/providers/:id/verify', async (req, res) => {
  try {
    const provider = await User.findByPk(req.params.id);
    if (!provider || provider.userType !== 'provider') {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.verified = req.body.verified !== undefined ? req.body.verified : !provider.verified;
    await provider.save();

    res.json({ message: `Provider ${provider.verified ? 'verified' : 'unverified'} successfully`, provider });
  } catch (error) {
    console.error('Verify provider error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all services
router.get('/services', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '', status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Service.findAndCountAll({
      where,
      include: [{ model: User, as: 'provider', attributes: ['id', 'name', 'email', 'businessName'] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      services: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update service
router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { name, description, price, category, status, duration } = req.body;

    if (name) service.name = name;
    if (description) service.description = description;
    if (price) service.price = price;
    if (category) service.category = category;
    if (status) service.status = status;
    if (duration) service.duration = duration;

    await service.save();

    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete service
router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }

    const include = [
      { 
        model: User, 
        as: 'user', 
        attributes: ['id', 'name', 'email', 'phone', 'location'] 
      },
      { 
        model: Service, 
        as: 'service', 
        attributes: ['id', 'name', 'category', 'price', 'description'],
        include: [
          {
            model: User,
            as: 'provider',
            attributes: ['id', 'name', 'email', 'businessName', 'phone']
          }
        ]
      }
    ];

    let bookings;
    let count;

    if (search) {
      const allBookings = await Booking.findAll({
        where,
        include
      });
      const filtered = allBookings.filter(booking => 
        booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        booking.service?.name?.toLowerCase().includes(search.toLowerCase())
      );
      count = filtered.length;
      bookings = filtered.slice(offset, offset + parseInt(limit));
    } else {
      const result = await Booking.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });
      count = result.count;
      bookings = result.rows;
    }

    res.json({
      bookings,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { status } = req.body;
    if (!['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Service, as: 'service', attributes: ['id', 'name'] }
      ]
    });

    res.json({ message: 'Booking status updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType: 'admin'
    });

    const adminData = await User.findByPk(admin.id);
    // Admin can see passwords - don't exclude it

    res.status(201).json({ message: 'Admin created successfully', admin: adminData });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
