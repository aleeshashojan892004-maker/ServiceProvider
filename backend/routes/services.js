import express from 'express';
import { Op } from 'sequelize';
import Service from '../models/Service.js';
import { Booking } from '../models/index.js';

const router = express.Router();

// Get all services with filters
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, minRating, sortBy } = req.query;
    
    const where = { isActive: true };

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      where.category = { [Op.like]: `%${category}%` };
    }

    // Price filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      where.rating = { [Op.gte]: Number(minRating) };
    }

    // Sort options
    let order = [['createdAt', 'DESC']]; // Default: newest first
    if (sortBy === 'price-low') {
      order = [['price', 'ASC']];
    } else if (sortBy === 'price-high') {
      order = [['price', 'DESC']];
    } else if (sortBy === 'rating') {
      order = [['rating', 'DESC']];
    }

    const services = await Service.findAll({ where, order });
    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: ['category'],
      group: ['category']
    });
    const categories = services.map(s => s.category);
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check service availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { date, time } = req.query;
    const serviceId = req.params.id;

    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }

    // Check if service exists and is active
    const service = await Service.findByPk(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not available' });
    }

    // Check for existing bookings at the same date and time
    const { Booking } = await import('../models/index.js');
    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingBooking = await Booking.findOne({
      where: {
        serviceId: serviceId,
        bookingDate: {
          [Op.between]: [startOfDay, endOfDay]
        },
        bookingTime: time,
        status: {
          [Op.notIn]: ['cancelled', 'completed']
        }
      }
    });

    const isAvailable = !existingBooking;

    res.json({
      available: isAvailable,
      message: isAvailable ? 'Slot is available' : 'Slot is already booked',
      service: {
        id: service.id,
        title: service.title,
        price: service.price
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
