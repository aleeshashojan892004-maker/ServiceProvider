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
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        // If parsing fails, return as string
        return value;
      }
    },
    set(value) {
      if (value === null || value === undefined) {
        this.setDataValue('location', null);
      } else if (typeof value === 'string') {
        // If it's already a string, try to parse it first to validate
        try {
          JSON.parse(value);
          this.setDataValue('location', value);
        } catch (e) {
          // If it's not valid JSON, store as plain string
          this.setDataValue('location', value);
        }
      } else {
        // If it's an object, stringify it
        this.setDataValue('location', JSON.stringify(value));
      }
    }
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  userType: {
    type: DataTypes.ENUM('user', 'provider', 'admin'),
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
      if (!value) return [];
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        // If parsing fails, return empty array
        return [];
      }
    },
    set(value) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        this.setDataValue('serviceAreas', null);
      } else if (Array.isArray(value)) {
        this.setDataValue('serviceAreas', JSON.stringify(value));
      } else if (typeof value === 'string') {
        try {
          // Try to parse and validate
          const parsed = JSON.parse(value);
          this.setDataValue('serviceAreas', Array.isArray(parsed) ? JSON.stringify(parsed) : null);
        } catch (e) {
          // If not valid JSON, store as array with single value
          this.setDataValue('serviceAreas', JSON.stringify([value]));
        }
      } else {
        this.setDataValue('serviceAreas', JSON.stringify([value]));
      }
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
