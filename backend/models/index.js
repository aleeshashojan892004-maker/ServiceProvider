import User from './User.js';
import Service from './Service.js';
import Booking from './Booking.js';
import Cart from './Cart.js';

// Define associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Service.hasMany(Booking, { foreignKey: 'serviceId', as: 'bookings' });
Booking.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

User.hasMany(Service, { foreignKey: 'providerId', as: 'services' });
Service.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

// Cart associations
User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Service.hasMany(Cart, { foreignKey: 'serviceId', as: 'cartItems' });
Cart.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

export { User, Service, Booking, Cart };
