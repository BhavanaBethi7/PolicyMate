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
      type: String,
      enum: ['10th', '12th', 'Diploma', 'Undergraduate', 'Postgraduate']
    }],
    categories: [{
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS']
    }],
    income: {
      type: String,
      enum: ['<1L', '1-3L', '3-5L', '5-8L', '8L+', 'Any']
    },
    states: [{
      type: String
    }],
    age: {
      min: Number,
      max: Number
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Any']
    },
    locationType: {
      type: String,
      enum: ['Urban', 'Rural', 'Any']
    },
    firstGraduate: {
      type: String,
      enum: ['Yes', 'No', 'Any']
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
