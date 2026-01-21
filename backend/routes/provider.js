import express from 'express';
import { Service, Booking, User } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Middleware to check if user is a provider
const checkProvider = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user || user.userType !== 'provider') {
      return res.status(403).json({ message: 'Access denied. Provider account required.' });
    }
    req.provider = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

router.use(checkProvider);

// ========== SERVICE MANAGEMENT ==========

// Get all services for the provider
router.get('/services', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { providerId: req.user.userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ services });
  } catch (error) {
    console.error('Get provider services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new service
router.post('/services', async (req, res) => {
  try {
    const { title, category, description, price, image } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ message: 'Title, category, and price are required' });
    }

    const service = await Service.create({
      title,
      category,
      description: description || '',
      price: parseFloat(price),
      image: image || '',
      providerId: req.user.userId,
      rating: 0,
      reviews: 0,
      isActive: true
    });

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a service
router.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, price, image, isActive } = req.body;

    const service = await Service.findOne({
      where: {
        id,
        providerId: req.user.userId
      }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update fields
    if (title !== undefined) service.title = title;
    if (category !== undefined) service.category = category;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = parseFloat(price);
    if (image !== undefined) service.image = image;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a service (soft delete by setting isActive to false)
router.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findOne({
      where: {
        id,
        providerId: req.user.userId
      }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Soft delete
    service.isActive = false;
    await service.save();

    res.json({
      message: 'Service deleted successfully',
      service
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== BOOKING MANAGEMENT ==========

// Get all bookings for provider's services
router.get('/bookings', async (req, res) => {
  try {
    const { status } = req.query;

    // Get all service IDs for this provider
    const providerServices = await Service.findAll({
      where: { providerId: req.user.userId },
      attributes: ['id']
    });
    const serviceIds = providerServices.map(s => s.id);

    if (serviceIds.length === 0) {
      return res.json({ bookings: [] });
    }

    const where = {
      serviceId: { [Op.in]: serviceIds }
    };

    if (status) {
      where.status = status;
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'category', 'price', 'image']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (provider can confirm, complete, or cancel)
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id, {
      include: [{
        model: Service,
        as: 'service',
        attributes: ['id', 'providerId']
      }]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the service belongs to this provider
    if (booking.service.providerId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get provider dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get provider's services
    const services = await Service.findAll({
      where: { providerId: req.user.userId },
      attributes: ['id']
    });
    const serviceIds = services.map(s => s.id);

    // Get total bookings
    const totalBookings = await Booking.count({
      where: {
        serviceId: { [Op.in]: serviceIds }
      }
    });

    // Get completed bookings for earnings calculation
    const completedBookings = await Booking.findAll({
      where: {
        serviceId: { [Op.in]: serviceIds },
        status: 'completed'
      },
      include: [{
        model: Service,
        as: 'service',
        attributes: ['price']
      }]
    });

    const totalEarnings = completedBookings.reduce((sum, booking) => {
      return sum + parseFloat(booking.totalAmount || booking.service?.price || 0);
    }, 0);

    // Calculate average rating
    const servicesWithRatings = await Service.findAll({
      where: { providerId: req.user.userId },
      attributes: ['rating']
    });

    const avgRating = servicesWithRatings.length > 0
      ? servicesWithRatings.reduce((sum, s) => sum + parseFloat(s.rating || 0), 0) / servicesWithRatings.length
      : 0;

    res.json({
      stats: {
        totalBookings,
        totalEarnings: Math.round(totalEarnings),
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalServices: services.length
      }
    });
  } catch (error) {
    console.error('Get provider stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
