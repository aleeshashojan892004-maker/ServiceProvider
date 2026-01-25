import connectDB from '../config/database.js';
import { User, Service } from '../models/index.js';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';

/**
 * Complete Setup Script for Team
 * Resets database, seeds services, and creates test users
 */

const setupForTeam = async () => {
  try {
    console.log('🚀 Setting up project for team...\n');

    // 1. Connect to database
    console.log('📡 Connecting to database...');
    await connectDB();

    // 2. Reset database
    console.log('\n🔄 Resetting database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database reset complete');

    // 3. Seed services
    console.log('\n📦 Seeding services...');
    const services = [
      { title: "AC Service & Repair", category: "AC & Appliance", price: 499, rating: 4.8, reviews: 2000000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional AC service and repair" },
      { title: "Bathroom Cleaning", category: "Cleaning", price: 399, rating: 4.7, reviews: 1500000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757635235-5720d3.png", description: "Deep cleaning for bathrooms" },
      { title: "Sofa Cleaning", category: "Cleaning", price: 799, rating: 4.8, reviews: 800000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional sofa cleaning service" },
      { title: "Full Home Cleaning", category: "Cleaning", price: 2999, rating: 4.6, reviews: 500000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757635235-5720d3.png", description: "Complete home cleaning service" },
      { title: "Electrician Service", category: "Electrician", price: 299, rating: 4.5, reviews: 1000000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Expert electrician services" },
      { title: "Plumbing Service", category: "Plumber", price: 349, rating: 4.6, reviews: 1200000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional plumbing solutions" },
      { title: "Haircut for Men", category: "Men's Salon", price: 249, rating: 4.8, reviews: 500000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Men's haircut and styling" },
      { title: "Classic Shave", category: "Men's Salon", price: 199, rating: 4.7, reviews: 300000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Traditional shave service" },
      { title: "Women's Haircut", category: "Women's Salon", price: 699, rating: 4.9, reviews: 1000000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Women's haircut and styling" },
      { title: "Manicure & Pedicure", category: "Women's Salon", price: 999, rating: 4.8, reviews: 800000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Nail care and grooming" },
      { title: "Wall Painting (Per sq ft)", category: "Painting", price: 12, rating: 4.6, reviews: 100000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional wall painting" },
      { title: "Furniture Assembly", category: "Carpentry", price: 399, rating: 4.7, reviews: 200000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Furniture assembly service" },
      { title: "Door Repair", category: "Carpentry", price: 299, rating: 4.5, reviews: 150000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Door repair and maintenance" }
    ];

    await Service.bulkCreate(services);
    console.log(`✅ Created ${services.length} services`);

    // 4. Create test users
    console.log('\n👥 Creating test users...');
    
    const userPassword = await bcrypt.hash('test123', 10);
    const providerPassword = await bcrypt.hash('test123', 10);

    await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: userPassword,
      phone: '+91 9876543210',
      userType: 'user',
      location: JSON.stringify({
        address: '123 Test Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      })
    });

    await User.create({
      name: 'Test Provider',
      email: 'provider@test.com',
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
    });

    console.log('✅ Test users created');

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ SETUP COMPLETE!');
    console.log('='.repeat(50));
    console.log('\n📊 Database Status:');
    const userCount = await User.count();
    const serviceCount = await Service.count();
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🔧 Services: ${serviceCount}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   User Account:');
    console.log('     Email: user@test.com');
    console.log('     Password: test123');
    console.log('   Provider Account:');
    console.log('     Email: provider@test.com');
    console.log('     Password: test123');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Start backend: cd backend && npm run dev');
    console.log('   2. Start frontend: cd frontend && npm run dev');
    console.log('   3. Open: http://localhost:5173');
    console.log('\n' + '='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup failed:');
    console.error(error);
    process.exit(1);
  }
};

setupForTeam();
