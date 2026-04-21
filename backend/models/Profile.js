const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  
  // Personal Details
  name: String,
  age: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  category: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS', '']
  },
  
  // Location
  state: String,
  placeOfBirth: String,
  locationType: {
    type: String,
    enum: ['Urban', 'Rural', '']
  },
  
  // Education
  educationLevel: {
    type: String,
    enum: ['10th', '12th', 'Diploma', 'Undergraduate', 'Postgraduate']
  },
  course: String,
  passingYear: String,
  
  // Career Preferences
  preferredSector: [{
    type: String,
    enum: ['IT', 'Government', 'Core Engineering', 'Research', 'Healthcare', 'Education', 'Finance', 'Public Services', 'Other']
  }],
  otherSector: String,
  lookingFor: [{
    type: String,
    enum: ['Scholarship', 'Internship', 'Govt Job', 'Training Program']
  }],
  
  // Financial
  income: String,
  incomeCertificate: {
    type: String,
    enum: ['Yes', 'No']
  },
  parentOccupation: String,
  firstGraduate: {
    type: String,
    enum: ['Yes', 'No']
  },
  
  // Metadata
  isComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Method to check if profile is complete
profileSchema.methods.checkCompleteness = function() {
  const requiredFields = [
    'educationLevel',
    'course', 
    'state',
    'income',
    'category'
  ];
  
  this.isComplete = requiredFields.every(field => 
    this[field] && this[field].toString().trim() !== ''
  );
  
  return this.isComplete;
};

module.exports = mongoose.model('Profile', profileSchema);
