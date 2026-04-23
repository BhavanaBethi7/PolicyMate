const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    };

    // Add retry writes and read preferences for Atlas
    if (process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb.net')) {
      options.retryWrites = true;
      options.readPreference = 'primaryPreferred';
      options.writeConcern = {
        w: 'majority',
        j: true
      };
    }

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

module.exports = connectDB;