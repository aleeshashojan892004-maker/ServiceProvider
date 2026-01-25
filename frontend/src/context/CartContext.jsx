import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useUser } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from database when user logs in
  useEffect(() => {
    if (user.isLoggedIn) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [user.isLoggedIn]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.cart || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    if (!user.isLoggedIn) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const serviceId = item.service?.id || item.id;
      await cartAPI.addToCart(serviceId, item.quantity || 1);
      await loadCart(); // Reload cart from database
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      await loadCart(); // Reload cart from database
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartAPI.updateCartItem(cartItemId, quantity);
      await loadCart(); // Reload cart from database
    } catch (error) {
      console.error('Failed to update cart item:', error);
      alert('Failed to update item quantity. Please try again.');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.service?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + (parseFloat(price) * quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading,
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity,
      getCartTotal,
      reloadCart: loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
