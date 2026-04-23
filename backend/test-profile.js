const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('./models/Profile');
const User = require('./models/UserModel');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const testProfileSave = async () => {
  try {
    // Find a user first
    const user = await User.findOne();
    if (!user) {
      console.error('✗ No users found in database');
      return;
    }
    
    console.log('✓ Found user:', user.email);
    
    // Try to find or create a profile
    let profile = await Profile.findOne({ userId: user._id });
    
    if (profile) {
      console.log('✓ Profile exists');
      profile.name = 'Test Update ' + new Date().getTime();
    } else {
      console.log('○ Creating new profile');
      profile = new Profile({
        userId: user._id,
        name: 'Test Profile',
        educationLevel: 'Undergraduate',
        course: 'Computer Science',
        state: 'Karnataka',
        income: '500000',
        category: 'General'
      });
    }
    
    console.log('Saving profile...');
    await profile.save();
    console.log('✓ Profile saved successfully');
    console.log('Profile ID:', profile._id);
    
    // Verify it was saved
    const saved = await Profile.findOne({ userId: user._id });
    if (saved) {
      console.log('✓ Profile verified in database');
    } else {
      console.log('✗ Profile not found after save');
    }
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error.stack);
  }
};

const main = async () => {
  await connectDB();
  await testProfileSave();
  await mongoose.connection.close();
  console.log('Done');
};

main();
