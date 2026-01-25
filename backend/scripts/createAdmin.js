import connectDB, { sequelize } from '../config/database.js';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    console.log('🚀 Creating Super Admin Account...\n');
    
    await connectDB();

    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    if (!name || !email || !password) {
      console.error('❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters long!');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingAdmin) {
      console.error('❌ Admin with this email already exists!');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType: 'admin'
    });

    console.log('\n✅ Super Admin created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   User Type: ${admin.userType}`);
    console.log('\n🔑 You can now login with these credentials at /login (select Admin)');

  } catch (error) {
    console.error('\n❌ Failed to create admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await sequelize.close();
    process.exit(0);
  }
};

createAdmin();
