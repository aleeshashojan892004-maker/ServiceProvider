import express from 'express';
import { Cart, Service } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.userId },
      include: [{
        model: Service,
        as: 'service',
        attributes: ['id', 'title', 'category', 'price', 'image', 'description']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ cart: cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { serviceId, quantity = 1 } = req.body;

    if (!serviceId) {
      return res.status(400).json({ message: 'Service ID is required' });
    }

    // Check if service exists
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if item already in cart
    const existingItem = await Cart.findOne({
      where: {
        userId: req.user.userId,
        serviceId: serviceId
      }
    });

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
      await existingItem.save();

      const cartItem = await Cart.findByPk(existingItem.id, {
        include: [{
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'category', 'price', 'image', 'description']
        }]
      });

      return res.json({
        message: 'Cart item quantity updated',
        cartItem
      });
    }

    // Create new cart item
    const cartItem = await Cart.create({
      userId: req.user.userId,
      serviceId: serviceId,
      quantity: quantity
    });

    const cartItemWithService = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Service,
        as: 'service',
        attributes: ['id', 'title', 'category', 'price', 'image', 'description']
      }]
    });

    res.status(201).json({
      message: 'Item added to cart',
      cartItem: cartItemWithService
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const cartItemWithService = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Service,
        as: 'service',
        attributes: ['id', 'title', 'category', 'price', 'image', 'description']
      }]
    });

    res.json({
      message: 'Cart item updated',
      cartItem: cartItemWithService
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear entire cart
router.delete('/clear', async (req, res) => {
  try {
    await Cart.destroy({
      where: { userId: req.user.userId }
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
