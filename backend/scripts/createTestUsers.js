import connectDB from '../config/database.js';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

/**
 * Create Test Users Script
 * Creates sample user and provider accounts for testing
 */

const createTestUsers = async () => {
  try {
    console.log('🚀 Creating test users...\n');

    // Connect to database
    await connectDB();

    // Test User
    const userEmail = 'user@test.com';
    const userPassword = await bcrypt.hash('test123', 10);
    
    const [user, userCreated] = await User.findOrCreate({
      where: { email: userEmail },
      defaults: {
        name: 'Test User',
        email: userEmail,
        password: userPassword,
        phone: '+91 9876543210',
        userType: 'user',
        location: JSON.stringify({
          address: '123 Test Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        })
      }
    });

    if (userCreated) {
      console.log('✅ Created test user:');
      console.log(`   Email: ${userEmail}`);
      console.log(`   Password: test123`);
    } else {
      console.log('ℹ️  Test user already exists');
    }

    // Test Provider
    const providerEmail = 'provider@test.com';
    const providerPassword = await bcrypt.hash('test123', 10);
    
    const [provider, providerCreated] = await User.findOrCreate({
      where: { email: providerEmail },
      defaults: {
        name: 'Test Provider',
        email: providerEmail,
        password: providerPassword,
        phone: '+91 9876543211',
        userType: 'provider',
        businessName: 'Test Services Pvt Ltd',
        bio: 'Professional service provider with years of experience',
        serviceAreas: JSON.stringify(['Bangalore', 'Mumbai', 'Delhi']),
        experience: 5,
        location: JSON.stringify({
          address: '456 Provider Avenue',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560002'
        })
      }
    });

    if (providerCreated) {
      console.log('\n✅ Created test provider:');
      console.log(`   Email: ${providerEmail}`);
      console.log(`   Password: test123`);
      console.log(`   Business: ${provider.businessName}`);
    } else {
      console.log('\nℹ️  Test provider already exists');
    }

    console.log('\n✅ Test users created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   User Account:');
    console.log(`     Email: ${userEmail}`);
    console.log(`     Password: test123`);
    console.log('   Provider Account:');
    console.log(`     Email: ${providerEmail}`);
    console.log(`     Password: test123`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to create test users:');
    console.error(error);
    process.exit(1);
  }
};

// Run script
createTestUsers();
