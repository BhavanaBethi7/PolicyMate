const Scheme = require('../models/Scheme');
const mongoose = require('mongoose');

const dummySchemes = [
  {
    name: "PM Scholarship Scheme",
    description: "Merit-based scholarship for meritorious students from economically weaker sections",
    category: "Scholarship",
    eligibility: {
      education: ['12th', 'Undergraduate'],
      categories: ['SC', 'ST', 'OBC', 'EWS'],
      income: '<1L',
      states: ['All India'],
      age: { min: 17, max: 25 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Yes'
    },
    benefits: [
      'Up to INR 12,000 per annum',
      'Renewable for up to 3 years',
      'No service bond required'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on National Scholarship Portal' },
      { step: 2, description: 'Fill application form with academic details' },
      { step: 3, description: 'Upload income and caste certificates' },
      { step: 4, description: 'Submit and wait for verification' }
    ],
    officialLink: 'https://www.scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in/fresh/login',
    duration: '3 years',
    amount: 'INR 12,000/year',
    lastDate: '31st October 2024',
    featured: true
  },
  
  {
    name: "Digital India Internship",
    description: "Paid internship program for students interested in digital technologies and government initiatives",
    category: "Internship",
    eligibility: {
      education: ['Undergraduate', 'Postgraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['All India'],
      age: { min: 18, max: 30 },
      gender: 'Any',
      locationType: 'Urban',
      firstGraduate: 'Any'
    },
    benefits: [
      'Monthly stipend of INR 10,000',
      'Certificate of completion',
      'Work experience in government projects'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply through Digital India portal' },
      { step: 2, description: 'Submit resume and academic records' },
      { step: 3, description: 'Online assessment test' },
      { step: 4, description: 'Virtual interview and selection' }
    ],
    officialLink: 'https://digitalindia.gov.in',
    applicationLink: 'https://internship.digitalindia.gov.in',
    duration: '6 months',
    amount: 'INR 10,000/month',
    lastDate: '15th November 2024',
    featured: false
  },
  
  {
    name: "SSC Graduate Level Exam",
    description: "Staff Selection Commission exam for various government posts in central government departments",
    category: "Govt Job",
    eligibility: {
      education: ['Undergraduate', 'Postgraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['All India'],
      age: { min: 20, max: 30 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Grade Pay starting from INR 4,200',
      'Job security and pension benefits',
      'Promotion opportunities in government service'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on SSC official website' },
      { step: 2, description: 'Fill application form and pay fees' },
      { step: 3, description: 'Appear for Tier-1 written exam' },
      { step: 4, description: 'Clear Tier-2 exam and interview' }
    ],
    officialLink: 'https://ssc.nic.in',
    applicationLink: 'https://ssc.nic.in/Portal/Apply',
    duration: 'Permanent',
    amount: 'INR 35,400-1,12,400/month',
    lastDate: '30th November 2024',
    featured: true
  },
  
  {
    name: "Skill India Training Program",
    description: "Free skill development training program for unemployed youth across various sectors",
    category: "Training Program",
    eligibility: {
      education: ['10th', '12th', 'Diploma'],
      categories: ['SC', 'ST', 'OBC', 'EWS'],
      income: '1-3L',
      states: ['All India'],
      age: { min: 18, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Free training with certification',
      'Placement assistance',
      'Stipend during training period'
    ],
    applicationProcess: [
      { step: 1, description: 'Visit nearest Skill India center' },
      { step: 2, description: 'Submit required documents' },
      { step: 3, description: 'Choose training course' },
      { step: 4, description: 'Start training program' }
    ],
    officialLink: 'https://skillindia.gov.in',
    applicationLink: 'https://skillindia.gov.in/participant',
    duration: '3-6 months',
    amount: 'INR 5,000-8,000 stipend',
    lastDate: 'Rolling admissions',
    featured: false
  },
  
  {
    name: "National Fellowship for SC Students",
    description: "Fellowship for SC students pursuing higher education in professional courses",
    category: "Scholarship",
    eligibility: {
      education: ['Postgraduate'],
      categories: ['SC'],
      income: 'Any',
      states: ['All India'],
      age: { min: 22, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Fellowship amount of INR 25,000/month',
      'Contingency allowance of INR 15,000/year',
      'Research support and mentorship'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply through National Scholarship Portal' },
      { step: 2, description: 'Submit research proposal' },
      { step: 3, description: 'Upload academic and caste certificates' },
      { step: 4, description: 'Selection committee review' }
    ],
    officialLink: 'https://socialjustice.nic.in',
    applicationLink: 'https://scholarships.gov.in/main',
    duration: '3 years',
    amount: 'INR 25,000/month',
    lastDate: '15th December 2024',
    featured: true
  },
  
  {
    name: "State Government IT Jobs",
    description: "Various IT positions in state government departments and public sector undertakings",
    category: "Govt Job",
    eligibility: {
      education: ['Undergraduate', 'Postgraduate', 'Diploma'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'],
      age: { min: 21, max: 38 },
      gender: 'Any',
      locationType: 'Urban',
      firstGraduate: 'Any'
    },
    benefits: [
      'Salary range INR 35,000-80,000/month',
      'State government benefits',
      'Work-life balance and job security'
    ],
    applicationProcess: [
      { step: 1, description: 'Check state government job portal' },
      { step: 2, description: 'Apply online with required documents' },
      { step: 3, description: 'Written examination' },
      { step: 4, description: 'Interview and document verification' }
    ],
    officialLink: 'https://www.india.gov.in',
    applicationLink: 'https://employmentnews.gov.in',
    duration: 'Permanent',
    amount: 'INR 35,000-80,000/month',
    lastDate: 'Varies by state',
    featured: false
  },
  
  {
    name: "Women Entrepreneurship Program",
    description: "Special training and funding program for women entrepreneurs in rural areas",
    category: "Training Program",
    eligibility: {
      education: ['10th', '12th', 'Diploma', 'Undergraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: '3-5L',
      states: ['Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar'],
      age: { min: 18, max: 45 },
      gender: 'Female',
      locationType: 'Rural',
      firstGraduate: 'Any'
    },
    benefits: [
      'Free business training',
      'Seed funding up to INR 50,000',
      'Mentorship and networking'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on women entrepreneurship portal' },
      { step: 2, description: 'Submit business idea proposal' },
      { step: 3, description: 'Interview and selection' },
      { step: 4, description: 'Start training program' }
    ],
    officialLink: 'https://womenentrepreneur.gov.in',
    applicationLink: 'https://wep.gov.in/apply',
    duration: '3 months',
    amount: 'INR 50,000 seed funding',
    lastDate: '20th November 2024',
    featured: true
  }
];

const seedSchemes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PolicyMate');
    console.log('Connected to MongoDB');
    
    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('✓ Cleared existing schemes');
    
    // Add active field to all schemes
    const schemesWithActive = dummySchemes.map(scheme => ({
      ...scheme,
      active: true
    }));
    
    // Insert dummy schemes
    const result = await Scheme.insertMany(schemesWithActive);
    console.log(`✓ Inserted ${result.length} dummy schemes successfully`);
    
    // Verify insertion
    const count = await Scheme.countDocuments({ active: true });
    console.log(`✓ Total active schemes in database: ${count}`);
    
    mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding schemes:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedSchemes();
}

module.exports = seedSchemes;
