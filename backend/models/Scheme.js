const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Scholarship', 'Internship', 'Govt Job', 'Training Program'],
    required: true
  },
  
  // Eligibility Criteria
  eligibility: {
    education: [{
      type: String
    }],
    categories: [{
      type: String
    }],
    income: {
      type: String
    },
    states: [{
      type: String
    }],
    age: {
      min: Number,
      max: Number
    },
    gender: {
      type: String
    },
    locationType: {
      type: String
    },
    firstGraduate: {
      type: String
    }
  },
  
  // Benefits
  benefits: [{
    type: String
  }],
  
  // Application Process
  applicationProcess: [{
    step: Number,
    description: String
  }],
  
  // Official Links
  officialLink: String,
  applicationLink: String,
  
  // Additional Info
  duration: String,
  amount: String,
  lastDate: String,
  
  // Metadata
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
schemeSchema.index({ category: 1 });
schemeSchema.index({ 'eligibility.education': 1 });
schemeSchema.index({ 'eligibility.categories': 1 });
schemeSchema.index({ 'eligibility.states': 1 });
schemeSchema.index({ featured: 1, active: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
