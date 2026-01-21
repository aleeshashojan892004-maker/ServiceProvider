import express from 'express';
import { Booking, Service } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { serviceId, bookingDate, bookingTime, address, totalAmount } = req.body;

    // Load service details to get providerId
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = await Booking.create({
      userId: req.user.userId,
      serviceId,
      providerId: service.providerId,
      bookingDate,
      bookingTime,
      address,
      totalAmount
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        ...booking.toJSON(),
        service: service ? {
          title: service.title,
          category: service.category,
          price: service.price,
          image: service.image
        } : null
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query; // Filter by status (pending, confirmed, etc.)
    
    const where = { userId: req.user.userId };
    if (status) {
      where.status = status;
    }

    const bookings = await Booking.findAll({
      where,
      include: [{
        model: Service,
        as: 'service',
        attributes: ['id', 'title', 'category', 'price', 'image']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking by ID (order details)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{
        model: Service,
        as: 'service',
        attributes: ['id', 'title', 'category', 'price', 'image', 'description']
      }]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
