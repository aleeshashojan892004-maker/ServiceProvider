import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    trim: true
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,
    // Store as JSON string
    get() {
      const value = this.getDataValue('location');
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue('location', value ? JSON.stringify(value) : null);
    }
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  userType: {
    type: DataTypes.ENUM('user', 'provider'),
    defaultValue: 'user'
  },
  // Provider-specific fields
  businessName: {
    type: DataTypes.STRING,
    allowNull: true,
    trim: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  serviceAreas: {
    type: DataTypes.TEXT,
    allowNull: true,
    // Store as JSON string (array of areas/cities)
    get() {
      const value = this.getDataValue('serviceAreas');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('serviceAreas', value ? JSON.stringify(value) : null);
    }
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0 // Years of experience
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default User;
