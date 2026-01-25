import connectDB from '../config/database.js';
import { User, Service, Booking } from '../models/index.js';
import { sequelize } from '../config/database.js';

/**
 * Database Initialization Script
 * Creates all tables and sets up the database structure
 */

const initDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...\n');

    // Connect to database
    console.log('📡 Connecting to database...');
    await connectDB();

    // Sync all models (create tables if they don't exist)
    console.log('\n📋 Creating/Updating database tables...');
    
    // Use force: false to preserve existing data, or force: true to drop and recreate
    const FORCE_RESET = process.argv.includes('--force') || process.argv.includes('-f');
    
    if (FORCE_RESET) {
      console.log('⚠️  FORCE MODE: Dropping existing tables and recreating...');
      await sequelize.sync({ force: true });
      console.log('✅ All tables dropped and recreated');
    } else {
      try {
        await sequelize.sync({ alter: true });
        console.log('✅ All tables synchronized (preserving existing data)');
      } catch (syncError) {
        if (syncError.message.includes('SQLITE_ERROR') || syncError.message.includes('backup')) {
          console.log('\n⚠️  Schema mismatch detected. The database structure needs to be reset.');
          console.log('💡 Run with --force flag to reset: npm run reset-db');
          console.log('   Or manually: node scripts/initDatabase.js --force\n');
          throw syncError;
        }
        throw syncError;
      }
    }

    // Verify tables were created
    console.log('\n🔍 Verifying database structure...');
    
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log(`✅ Found ${tables.length} tables: ${tables.join(', ')}`);

    // Check table structures
    if (tables.includes('users')) {
      const userColumns = await sequelize.getQueryInterface().describeTable('users');
      console.log(`\n📊 Users table has ${Object.keys(userColumns).length} columns:`);
      Object.keys(userColumns).forEach(col => {
        console.log(`   - ${col}: ${userColumns[col].type}${userColumns[col].allowNull ? '' : ' (required)'}`);
      });
    }

    if (tables.includes('services')) {
      const serviceColumns = await sequelize.getQueryInterface().describeTable('services');
      console.log(`\n📊 Services table has ${Object.keys(serviceColumns).length} columns`);
    }

    if (tables.includes('bookings')) {
      const bookingColumns = await sequelize.getQueryInterface().describeTable('bookings');
      console.log(`\n📊 Bookings table has ${Object.keys(bookingColumns).length} columns`);
    }

    // Count existing records
    console.log('\n📈 Database Statistics:');
    const userCount = await User.count();
    const serviceCount = await Service.count();
    const bookingCount = await Booking.count();
    
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🔧 Services: ${serviceCount}`);
    console.log(`   📅 Bookings: ${bookingCount}`);

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n💡 Tips:');
    console.log('   - Run "node scripts/seedServices.js" to add sample services');
    console.log('   - Use --force flag to reset database: "node scripts/initDatabase.js --force"');
    console.log('   - Database file location: backend/database.sqlite');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();
