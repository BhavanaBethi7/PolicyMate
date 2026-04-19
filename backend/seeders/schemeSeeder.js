const Scheme = require('../models/Scheme');
const mongoose = require('mongoose');

const dummySchemes = [
  {
    name: 'Central Sector Scheme of Scholarship for College and University Students',
    description: 'Scholarship by Department of Higher Education for meritorious students pursuing regular college and university courses.',
    category: 'Scholarship',
    eligibility: {
      education: ['12th', 'Undergraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: '8L+',
      states: ['All India'],
      age: { min: 17, max: 25 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Financial assistance for higher education',
      'Renewable subject to academic performance',
      'Disbursal through Direct Benefit Transfer'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on National Scholarship Portal' },
      { step: 2, description: 'Fill fresh application under central schemes' },
      { step: 3, description: 'Upload required academic and bank documents' },
      { step: 4, description: 'Submit and track institute/state verification status' }
    ],
    officialLink: 'https://scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: 'Course duration',
    amount: 'As per scheme norms',
    lastDate: 'As per annual notification',
    featured: true
  },
  {
    name: 'Post Matric Scholarship for SC Students',
    description: 'Central assistance for Scheduled Caste students studying in post-matric courses.',
    category: 'Scholarship',
    eligibility: {
      education: ['12th', 'Diploma', 'Undergraduate', 'Postgraduate'],
      categories: ['SC'],
      income: '3-5L',
      states: ['All India'],
      age: { min: 16, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Tuition and maintenance support',
      'Applicable to recognized post-matric courses',
      'Direct transfer of scholarship amount'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply through National Scholarship Portal' },
      { step: 2, description: 'Select Post Matric SC scholarship scheme' },
      { step: 3, description: 'Submit caste, income and admission proof' },
      { step: 4, description: 'Complete institute verification and final submission' }
    ],
    officialLink: 'https://socialjustice.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: 'Academic year (renewable)',
    amount: 'As per approved component',
    lastDate: 'As per annual notification',
    featured: true
  },
  {
    name: 'AICTE Pragati Scholarship for Girls',
    description: 'Scholarship for girl students admitted to technical diploma and degree programs in AICTE-approved institutions.',
    category: 'Scholarship',
    eligibility: {
      education: ['Diploma', 'Undergraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: '8L+',
      states: ['All India'],
      age: { min: 16, max: 30 },
      gender: 'Female',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Financial support for tuition and incidental expenses',
      'Encourages women participation in technical education',
      'Direct transfer to eligible beneficiaries'
    ],
    applicationProcess: [
      { step: 1, description: 'Visit AICTE scholarship section on NSP' },
      { step: 2, description: 'Submit academic and admission details' },
      { step: 3, description: 'Upload income and category documents as applicable' },
      { step: 4, description: 'Finalize submission before deadline' }
    ],
    officialLink: 'https://www.aicte-india.org',
    applicationLink: 'https://scholarships.gov.in',
    duration: 'Course duration (renewable)',
    amount: 'As per AICTE notification',
    lastDate: 'As per annual notification',
    featured: true
  },
  {
    name: 'AICTE Saksham Scholarship Scheme',
    description: 'Scholarship support for differently-abled students pursuing technical education in AICTE-approved institutions.',
    category: 'Scholarship',
    eligibility: {
      education: ['Diploma', 'Undergraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: '8L+',
      states: ['All India'],
      age: { min: 16, max: 30 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Financial assistance for technical education',
      'Support for differently-abled students',
      'Annual renewal subject to eligibility'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply through National Scholarship Portal' },
      { step: 2, description: 'Choose AICTE Saksham scheme' },
      { step: 3, description: 'Upload disability and admission certificates' },
      { step: 4, description: 'Submit and track application status online' }
    ],
    officialLink: 'https://www.aicte-india.org',
    applicationLink: 'https://scholarships.gov.in',
    duration: 'Course duration (renewable)',
    amount: 'As per AICTE notification',
    lastDate: 'As per annual notification',
    featured: false
  },
  {
    name: 'National Apprenticeship Training Scheme (NATS)',
    description: 'Government apprenticeship program for diploma and graduate students to gain practical industry experience.',
    category: 'Internship',
    eligibility: {
      education: ['Diploma', 'Undergraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['All India'],
      age: { min: 18, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Stipend during apprenticeship period',
      'Hands-on industrial training',
      'Improved employability through practical experience'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on NATS portal' },
      { step: 2, description: 'Complete profile and education details' },
      { step: 3, description: 'Apply to apprenticeship opportunities' },
      { step: 4, description: 'Join after selection by establishment' }
    ],
    officialLink: 'https://nats.education.gov.in',
    applicationLink: 'https://nats.education.gov.in',
    duration: '6 to 12 months',
    amount: 'Stipend as per apprenticeship norms',
    lastDate: 'Open throughout the year',
    featured: true
  },
  {
    name: 'Digital India Internship Scheme',
    description: 'Internship opportunity under MeitY for students to work on digital governance and technology projects.',
    category: 'Internship',
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
      'Exposure to digital governance initiatives',
      'Certificate on successful completion',
      'Stipend as per official notification'
    ],
    applicationProcess: [
      { step: 1, description: 'Check internship announcements on Digital India portal' },
      { step: 2, description: 'Submit online internship application' },
      { step: 3, description: 'Provide academic and project profile' },
      { step: 4, description: 'Attend screening/interview if shortlisted' }
    ],
    officialLink: 'https://www.digitalindia.gov.in',
    applicationLink: 'https://www.digitalindia.gov.in',
    duration: '2 to 6 months',
    amount: 'As per internship cycle',
    lastDate: 'As per internship notification',
    featured: false
  },
  {
    name: 'SSC Combined Graduate Level Examination (SSC CGL)',
    description: 'National level exam by Staff Selection Commission for recruitment to Group B and Group C posts in central government departments.',
    category: 'Govt Job',
    eligibility: {
      education: ['Undergraduate', 'Postgraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['All India'],
      age: { min: 18, max: 32 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Central government salary and allowances',
      'Career progression opportunities',
      'Job security and pension benefits as per rules'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on SSC official portal' },
      { step: 2, description: 'Complete online application for CGL' },
      { step: 3, description: 'Appear for tier-based examinations' },
      { step: 4, description: 'Complete document verification after final merit' }
    ],
    officialLink: 'https://ssc.gov.in',
    applicationLink: 'https://ssc.gov.in',
    duration: 'Permanent',
    amount: 'As per notified post pay level',
    lastDate: 'As per SSC notification',
    featured: true
  },
  {
    name: 'UPSC Civil Services Examination',
    description: 'Union Public Service Commission examination for recruitment to IAS, IPS, IFS and other central civil services.',
    category: 'Govt Job',
    eligibility: {
      education: ['Undergraduate', 'Postgraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['All India'],
      age: { min: 21, max: 32 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Prestigious civil service career',
      'Structured promotions and training',
      'Government salary and benefits as per cadre rules'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on UPSC online application portal' },
      { step: 2, description: 'Submit CSE application form' },
      { step: 3, description: 'Appear in Prelims, Mains and Interview' },
      { step: 4, description: 'Join service based on final rank and preference' }
    ],
    officialLink: 'https://upsc.gov.in',
    applicationLink: 'https://upsconline.nic.in',
    duration: 'Permanent',
    amount: 'As per central pay matrix',
    lastDate: 'As per UPSC notification',
    featured: true
  },
  {
    name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
    description: 'Flagship skill development initiative under Skill India for short-term training and recognition of prior learning.',
    category: 'Training Program',
    eligibility: {
      education: ['10th', '12th', 'Diploma', 'Undergraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['All India'],
      age: { min: 18, max: 45 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Industry-relevant skill training',
      'Certification aligned to NSQF',
      'Placement and career support in selected sectors'
    ],
    applicationProcess: [
      { step: 1, description: 'Locate nearest PMKVY training center' },
      { step: 2, description: 'Choose job-role specific training program' },
      { step: 3, description: 'Complete training and assessment' },
      { step: 4, description: 'Receive certification and placement support' }
    ],
    officialLink: 'https://www.skillindia.gov.in',
    applicationLink: 'https://www.skillindia.gov.in',
    duration: '2 to 6 months',
    amount: 'Program specific support',
    lastDate: 'Rolling intake by center',
    featured: false
  },
  {
    name: 'National Career Service Skill and Employment Support',
    description: 'Employment and skilling support ecosystem under National Career Service with job matching, counseling, and training linkage.',
    category: 'Training Program',
    eligibility: {
      education: ['10th', '12th', 'Diploma', 'Undergraduate', 'Postgraduate'],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      income: 'Any',
      states: ['All India'],
      age: { min: 18, max: 50 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Access to government employment exchange services',
      'Career counseling and job fairs',
      'Linkage to skilling and apprenticeship opportunities'
    ],
    applicationProcess: [
      { step: 1, description: 'Create job seeker profile on NCS portal' },
      { step: 2, description: 'Complete education, skills and location details' },
      { step: 3, description: 'Apply to listed vacancies and services' },
      { step: 4, description: 'Attend counseling or placement events as scheduled' }
    ],
    officialLink: 'https://www.ncs.gov.in',
    applicationLink: 'https://www.ncs.gov.in',
    duration: 'Ongoing',
    amount: 'Service based',
    lastDate: 'Open throughout the year',
    featured: false
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
    
    // Insert real schemes
    const result = await Scheme.insertMany(schemesWithActive);
    console.log(`✓ Inserted ${result.length} real schemes successfully`);
    
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
