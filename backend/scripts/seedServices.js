import Service from '../models/Service.js';
import { sequelize } from '../config/database.js';
import connectDB from '../config/database.js';

const services = [
  { title: "AC Service & Repair", category: "AC", price: 499, rating: 4.8, reviews: 2000000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional AC service and repair" },
  { title: "Bathroom Cleaning", category: "Cleaning", price: 399, rating: 4.7, reviews: 1500000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757635235-5720d3.png", description: "Deep cleaning for bathrooms" },
  { title: "Sofa Cleaning", category: "Cleaning", price: 799, rating: 4.8, reviews: 800000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional sofa cleaning service" },
  { title: "Full Home Cleaning", category: "Cleaning", price: 2999, rating: 4.6, reviews: 500000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757635235-5720d3.png", description: "Complete home cleaning service" },
  { title: "Electrician Service", category: "Electrician", price: 299, rating: 4.5, reviews: 1000000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Expert electrician services" },
  { title: "Plumbing Service", category: "Plumber", price: 349, rating: 4.6, reviews: 1200000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional plumbing solutions" },
  { title: "Haircut for Men", category: "Men", price: 249, rating: 4.8, reviews: 500000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Men's haircut and styling" },
  { title: "Classic Shave", category: "Men", price: 199, rating: 4.7, reviews: 300000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Traditional shave service" },
  { title: "Women's Haircut", category: "Salon", price: 699, rating: 4.9, reviews: 1000000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Women's haircut and styling" },
  { title: "Manicure & Pedicure", category: "Salon", price: 999, rating: 4.8, reviews: 800000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1606211470897-f72447.jpeg", description: "Nail care and grooming" },
  { title: "Wall Painting (Per sq ft)", category: "Painting", price: 12, rating: 4.6, reviews: 100000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Professional wall painting" },
  { title: "Furniture Assembly", category: "Carpentry", price: 399, rating: 4.7, reviews: 200000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Furniture assembly service" },
  { title: "Door Repair", category: "Carpentry", price: 299, rating: 4.5, reviews: 150000, image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png", description: "Door repair and maintenance" }
];

const seedServices = async () => {
  try {
    await connectDB();
    
    // Clear existing services
    await Service.destroy({ where: {}, truncate: true });
    
    // Insert services
    await Service.bulkCreate(services);
    
    console.log('✅ Services seeded successfully!');
    console.log(`📊 Created ${services.length} services`);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
};

seedServices();
