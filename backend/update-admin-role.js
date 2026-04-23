const mongoose = require('mongoose');
const User = require('./models/UserModel');
require('dotenv').config();

const updateAdminRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Update admin user role
    const result = await User.updateOne(
      { email: 'admin@policymate.com' },
      { role: 'admin' }
    );
    
    console.log('Update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin user role updated successfully');
    } else {
      console.log('ℹ️ Admin user already has admin role or user not found');
    }
    
    // Verify the update
    const adminUser = await User.findOne({ email: 'admin@policymate.com' });
    console.log('Admin user:', adminUser);
    
  } catch (error) {
    console.error('Error updating admin role:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateAdminRole();
