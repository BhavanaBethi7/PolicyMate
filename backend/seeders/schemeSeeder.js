const Scheme = require('../models/Scheme');
const mongoose = require('mongoose');

const Schemes = [
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
  },
  {
    name: 'PM YASASVI Scholarship 2026',
    description: 'Scholarship for OBC, EBC, DNT students studying in class 9-12',
    category: 'Scholarship',
    eligibility: {
      education: ['9th', '10th', '11th', '12th'],
      categories: ['OBC', 'EBC', 'DNT'],
      income: '<2.5L',
      states: ['All India'],
      age: { min: 13, max: 18 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'INR 75,000 per year',
      'INR 1,25,000 for senior classes'
    ],
    applicationProcess: [
      { step: 1, description: 'Visit NSP portal' },
      { step: 2, description: 'Register OTR' },
      { step: 3, description: 'Apply scholarship' },
      { step: 4, description: 'Submit form' }
    ],
    officialLink: 'https://scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: '2 years',
    amount: '75000-125000/year',
    lastDate: '31 Aug 2026',
    featured: true
  },
  {
    name: 'AICTE Pragati Scholarship 2026',
    description: 'Scholarship for girl students in technical education',
    category: 'Scholarship',
    eligibility: {
      education: ['Diploma', 'Undergraduate'],
      categories: ['All'],
      income: '<8L',
      states: ['All India'],
      age: { min: 17, max: 30 },
      gender: 'Female',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'INR 50,000 per year'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply via NSP' },
      { step: 2, description: 'Upload documents' },
      { step: 3, description: 'Institute verification' },
      { step: 4, description: 'Approval' }
    ],
    officialLink: 'https://www.aicte-india.org',
    applicationLink: 'https://scholarships.gov.in',
    duration: '4 years',
    amount: '50000/year',
    lastDate: 'October 2026',
    featured: true
  },
  {
    name: 'AICTE Saksham Scholarship 2026',
    description: 'Scholarship for specially abled technical students',
    category: 'Scholarship',
    eligibility: {
      education: ['Diploma', 'UG'],
      categories: ['PWD'],
      income: '<8L',
      states: ['All India'],
      age: { min: 17, max: 30 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'INR 50,000 per year'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply online' },
      { step: 2, description: 'Upload disability certificate' },
      { step: 3, description: 'Verification' },
      { step: 4, description: 'Approval' }
    ],
    officialLink: 'https://www.aicte-india.org',
    applicationLink: 'https://scholarships.gov.in',
    duration: '4 years',
    amount: '50000/year',
    lastDate: 'October 2026',
    featured: false
  },
  {
    name: 'Central Sector Scholarship 2026',
    description: 'Merit scholarship for college students',
    category: 'Scholarship',
    eligibility: {
      education: ['12th', 'Undergraduate'],
      categories: ['All'],
      income: '<4.5L',
      states: ['All India'],
      age: { min: 17, max: 25 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'INR 12,000 to 20,000 per year'
    ],
    applicationProcess: [
      { step: 1, description: 'Register NSP' },
      { step: 2, description: 'Apply scholarship' },
      { step: 3, description: 'Upload marks memo' },
      { step: 4, description: 'Submit' }
    ],
    officialLink: 'https://scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: '3 years',
    amount: '12000-20000/year',
    lastDate: 'Nov 2026',
    featured: true
  },
  {
    name: 'INSPIRE Scholarship 2026',
    description: 'Scholarship for science stream students',
    category: 'Scholarship',
    eligibility: {
      education: ['12th', 'UG'],
      categories: ['All'],
      income: 'No limit',
      states: ['All India'],
      age: { min: 17, max: 22 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'INR 80,000 per year'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply online' },
      { step: 2, description: 'Upload marks memo' },
      { step: 3, description: 'Verification' },
      { step: 4, description: 'Approval' }
    ],
    officialLink: 'https://online-inspire.gov.in',
    applicationLink: 'https://online-inspire.gov.in',
    duration: '5 years',
    amount: '80000/year',
    lastDate: 'Dec 2026',
    featured: false
  },
  {
    name: 'National Means-cum-Merit Scholarship 2026',
    description: 'Scholarship for economically weaker meritorious students',
    category: 'Scholarship',
    eligibility: {
      education: ['8th', '9th', '10th'],
      categories: ['All'],
      income: '<3.5L',
      states: ['All India'],
      age: { min: 13, max: 17 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'INR 12,000 per year',
      'Direct bank transfer'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply through NSP portal' },
      { step: 2, description: 'Fill academic details' },
      { step: 3, description: 'Upload documents' },
      { step: 4, description: 'Submit application' }
    ],
    officialLink: 'https://scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: '4 years',
    amount: '12000/year',
    lastDate: 'October 2026',
    featured: false
  },
  {
    name: 'Prime Minister Scholarship Scheme 2026',
    description: 'Scholarship for wards of ex-servicemen and CAPF personnel',
    category: 'Scholarship',
    eligibility: {
      education: ['Diploma', 'UG'],
      categories: ['Defence'],
      income: 'No limit',
      states: ['All India'],
      age: { min: 17, max: 30 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'Up to INR 30,000 per year',
      'Technical education support'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on portal' },
      { step: 2, description: 'Fill application form' },
      { step: 3, description: 'Upload service certificate' },
      { step: 4, description: 'Submit' }
    ],
    officialLink: 'https://www.desw.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: '4 years',
    amount: '30000/year',
    lastDate: 'Nov 2026',
    featured: true
  },
  {
    name: 'Post Matric Scholarship SC 2026',
    description: 'Financial support for SC students after class 10',
    category: 'Scholarship',
    eligibility: {
      education: ['11th', '12th', 'UG'],
      categories: ['SC'],
      income: '<2.5L',
      states: ['All India'],
      age: { min: 16, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'Tuition fee reimbursement',
      'Maintenance allowance'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply online' },
      { step: 2, description: 'Upload caste certificate' },
      { step: 3, description: 'Verification' },
      { step: 4, description: 'Approval' }
    ],
    officialLink: 'https://scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: 'Course duration',
    amount: 'Variable',
    lastDate: 'Dec 2026',
    featured: false
  },
  {
    name: 'Top Class Education Scheme SC 2026',
    description: 'Full financial support for SC students in premier institutions',
    category: 'Scholarship',
    eligibility: {
      education: ['UG', 'PG'],
      categories: ['SC'],
      income: '<8L',
      states: ['All India'],
      age: { min: 17, max: 30 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'Full tuition fee',
      'Living expenses',
      'Laptop allowance'
    ],
    applicationProcess: [
      { step: 1, description: 'Register NSP' },
      { step: 2, description: 'Apply scheme' },
      { step: 3, description: 'Upload documents' },
      { step: 4, description: 'Submit' }
    ],
    officialLink: 'https://scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: 'Course duration',
    amount: 'Full funding',
    lastDate: 'Nov 2026',
    featured: true
  },
  {
    name: 'Merit Cum Means Scholarship Minority 2026',
    description: 'Scholarship for minority community students',
    category: 'Scholarship',
    eligibility: {
      education: ['UG', 'PG', 'Professional'],
      categories: ['Minority'],
      income: '<2.5L',
      states: ['All India'],
      age: { min: 17, max: 30 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'No'
    },
    benefits: [
      'INR 20,000 per year',
      'Course fee reimbursement'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply on NSP' },
      { step: 2, description: 'Upload income certificate' },
      { step: 3, description: 'Verification' },
      { step: 4, description: 'Approval' }
    ],
    officialLink: 'https://scholarships.gov.in',
    applicationLink: 'https://scholarships.gov.in',
    duration: '3 years',
    amount: '20000/year',
    lastDate: 'Oct 2026',
    featured: false
  },
  {
    name: 'Telangana Post-Matric Scholarship (RTF & MTF)',
    description: 'Reimbursement of Tuition Fee (RTF) and Maintenance Fee (MTF) for students belonging to SC, ST, BC, and EBC categories.',
    category: 'Scholarship',
    eligibility: {
      education: ['Undergraduate', 'Postgraduate', 'Diploma'],
      categories: ['SC', 'ST', 'BC', 'EBC', 'Minority'],
      income: '<2L (Urban) / <1.5L (Rural)',
      states: ['Telangana'],
      age: { min: 16, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Full tuition fee reimbursement for government and aided colleges',
      'Monthly maintenance allowance (mess charges)',
      'Coverage for professional courses like Engineering and Medicine'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on Telangana ePASS portal' },
      { step: 2, description: 'Upload Aadhaar, Meeseva Caste, and Income certificates' },
      { step: 3, description: 'Submit bank passbook and bonafide details' },
      { step: 4, description: 'Biometric authentication at the college level' }
    ],
    officialLink: 'https://telanganaepass.cgg.gov.in',
    applicationLink: 'https://telanganaepass.cgg.gov.in',
    duration: 'Course duration',
    amount: 'Full Fee + Maintenance',
    lastDate: '31 Dec 2026',
    featured: true
  },
  {
    name: 'Chief Minister\'s Overseas Scholarship Scheme',
    description: 'Financial assistance for SC/ST/BC/Minority students to pursue higher education (Master\'s/PhD) in foreign universities.',
    category: 'Scholarship',
    eligibility: {
      education: ['Postgraduate', 'PhD'],
      categories: ['SC', 'ST', 'BC', 'Minority'],
      income: '<5L',
      states: ['Telangana'],
      age: { min: 21, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Grant of up to INR 20 Lakhs or actual fees (whichever is less)',
      'One-way economy airfare and visa fees',
      'Education loan assistance'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply via Telangana ePASS overseas portal' },
      { step: 2, description: 'Submit GRE/GMAT and IELTS/TOEFL scores' },
      { step: 3, description: 'Upload university admission offer letter' },
      { step: 4, description: 'Attend selection committee interview' }
    ],
    officialLink: 'https://telanganaepass.cgg.gov.in',
    applicationLink: 'https://telanganaepass.cgg.gov.in',
    duration: 'Course duration',
    amount: 'Up to 20 Lakhs',
    lastDate: 'As per intake cycle',
    featured: true
  },
  {
    name: 'Mahatma Jyotiba Phule BC Overseas Vidya Nidhi',
    description: 'Financial support for Backward Class (BC) students for overseas higher studies.',
    category: 'Scholarship',
    eligibility: {
      education: ['Postgraduate'],
      categories: ['BC'],
      income: '<5L',
      states: ['Telangana'],
      age: { min: 20, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Scholarship grant of INR 20 Lakhs',
      'Support for travel and living expenses',
      'Covers top universities in USA, UK, Australia, Canada, and Singapore'
    ],
    applicationProcess: [
      { step: 1, description: 'Online registration on ePASS' },
      { step: 2, description: 'Verification of academic credentials' },
      { step: 3, description: 'Submission of visa and I-20 documents' }
    ],
    officialLink: 'https://telanganaepass.cgg.gov.in',
    applicationLink: 'https://telanganaepass.cgg.gov.in',
    duration: '2 years',
    amount: '20 Lakhs',
    lastDate: '30 Nov 2026',
    featured: false
  },
  {
    name: 'Telangana Rythu Goshti (Skill Training for Rural Youth)',
    description: 'Specialized skill development and agricultural internship for wards of farmers.',
    category: 'Training Program',
    eligibility: {
      education: ['10th', '12th', 'Diploma'],
      categories: ['General', 'OBC', 'SC', 'ST'],
      income: 'Any',
      states: ['Telangana'],
      age: { min: 18, max: 30 },
      gender: 'Any',
      locationType: 'Rural',
      firstGraduate: 'Any'
    },
    benefits: [
      'Skill certification in modern agri-tech',
      'Daily stipend during training',
      'Toolkit assistance for self-employment'
    ],
    applicationProcess: [
      { step: 1, description: 'Register at local District Skill Center' },
      { step: 2, description: 'Provide proof of agricultural land (Pattadar Passbook)' },
      { step: 3, description: 'Attend 45-day training module' }
    ],
    officialLink: 'https://tstraining.telangana.gov.in',
    applicationLink: 'https://tstraining.telangana.gov.in',
    duration: '3 months',
    amount: 'Stipend based',
    lastDate: 'Rolling intake',
    featured: false
  },
  {
    name: 'Kalyana Lakshmi / Shaadi Mubarak (Student Incentive)',
    description: 'While primarily a marriage grant, it includes specific incentives for women who complete their degree before marriage.',
    category: 'Scholarship',
    eligibility: {
      education: ['Undergraduate'],
      categories: ['SC', 'ST', 'BC', 'Minority'],
      income: '<2L',
      states: ['Telangana'],
      age: { min: 18, max: 30 },
      gender: 'Female',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'One-time financial assistance of INR 1,00,116',
      'Incentivizes completion of higher education'
    ],
    applicationProcess: [
      { step: 1, description: 'Apply on ePASS portal before wedding' },
      { step: 2, description: 'Upload education certificates and age proof' },
      { step: 3, description: 'Inquiry by MRO/Tahsildar' }
    ],
    officialLink: 'https://telanganaepass.cgg.gov.in',
    applicationLink: 'https://telanganaepass.cgg.gov.in',
    duration: 'One-time',
    amount: '100116',
    lastDate: 'Before marriage date',
    featured: true
  },
  {
    name: 'Jagananna Vidya Deevena (Andhra Pradesh)',
    description: 'Complete fee reimbursement for students pursuing higher education in AP.',
    category: 'Scholarship',
    eligibility: {
      education: ['Undergraduate', 'Postgraduate', 'Diploma'],
      categories: ['SC', 'ST', 'BC', 'EBC', 'Kapu', 'Minority', 'PWD'],
      income: '<2.5L',
      states: ['Andhra Pradesh'],
      age: { min: 16, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      '100% tuition fee reimbursement',
      'Direct credit to the mother\'s bank account',
      'Covers Engineering, Medicine, and Professional courses'
    ],
    applicationProcess: [
      { step: 1, description: 'Register via Navasakam portal' },
      { step: 2, description: 'Volunteer-based verification at doorstep' },
      { step: 3, description: 'Validation by Secretariat' }
    ],
    officialLink: 'https://jaganannavidyadeevena.ap.gov.in',
    applicationLink: 'https://jaganannavidyadeevena.ap.gov.in',
    duration: 'Course duration',
    amount: 'Full Tuition Fee',
    lastDate: '31 Dec 2026',
    featured: true
  },
  {
    name: 'Kanyashree Prakalpa (West Bengal)',
    description: 'Conditional cash transfer scheme to improve the status and well-being of girls.',
    category: 'Scholarship',
    eligibility: {
      education: ['8th', '9th', '10th', '11th', '12th', 'Undergraduate'],
      categories: ['All'],
      income: '<1.2L',
      states: ['West Bengal'],
      age: { min: 13, max: 19 },
      gender: 'Female',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Annual scholarship of INR 1,000 (K1)',
      'One-time grant of INR 25,000 (K2) upon reaching age 18'
    ],
    applicationProcess: [
      { step: 1, description: 'Collect application form from school/college' },
      { step: 2, description: 'Submit with head of institution' },
      { step: 3, description: 'Track status on Kanyashree portal' }
    ],
    officialLink: 'https://www.wbkanyashree.gov.in',
    applicationLink: 'https://www.wbkanyashree.gov.in',
    duration: 'Until age 19',
    amount: '1000-25000',
    lastDate: 'Oct 2026',
    featured: true
  },
  {
    name: 'Mukhya Mantri Yuva Sambal Yojana (Rajasthan)',
    description: 'Unemployment allowance for educated youth while they prepare for competitive exams.',
    category: 'Internship',
    eligibility: {
      education: ['Undergraduate', 'Postgraduate'],
      categories: ['All'],
      income: '<2L',
      states: ['Rajasthan'],
      age: { min: 21, max: 35 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'INR 4,000 per month for males',
      'INR 4,500 per month for females/transgender/PWD',
      'Skill training opportunities'
    ],
    applicationProcess: [
      { step: 1, description: 'Register on SSO Rajasthan portal' },
      { step: 2, description: 'Apply for Employment Allowance' },
      { step: 3, description: 'Upload degree and domicile certificate' }
    ],
    officialLink: 'https://employment.livelihood.rajasthan.gov.in',
    applicationLink: 'https://sso.rajasthan.gov.in',
    duration: '2 years',
    amount: '4000-4500/month',
    lastDate: 'Rolling',
    featured: false
  },
  {
    name: 'MAHADIT Post-Matric Scholarship (Maharashtra)',
    description: 'Extensive scholarship portal for various categories for post-matric studies.',
    category: 'Scholarship',
    eligibility: {
      education: ['Undergraduate', 'Postgraduate', 'Diploma'],
      categories: ['SC', 'ST', 'OBC', 'VJNT', 'SBC', 'EBC'],
      income: '<8L',
      states: ['Maharashtra'],
      age: { min: 16, max: 30 },
      gender: 'Any',
      locationType: 'Any',
      firstGraduate: 'Any'
    },
    benefits: [
      'Tuition fee and Exam fee reimbursement',
      'Maintenance allowance for hostelers',
      'Special support for professional courses'
    ],
    applicationProcess: [
      { step: 1, description: 'Create profile on MahaDBT portal' },
      { step: 2, description: 'Map Aadhaar with bank account' },
      { step: 3, description: 'Select relevant department scheme' }
    ],
    officialLink: 'https://mahadbt.maharashtra.gov.in',
    applicationLink: 'https://mahadbt.maharashtra.gov.in',
    duration: 'Course duration',
    amount: 'Variable',
    lastDate: '31 March 2026',
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
    const schemesWithActive = Schemes.map(scheme => ({
      ...scheme,
      active: true
    }));
    
    console.log(`Attempting to insert ${schemesWithActive.length} schemes...`);
    
    // Insert real schemes with error handling
    const result = await Scheme.insertMany(schemesWithActive, { ordered: false }).catch(err => {
      console.error('❌ Insertion errors:', err.writeErrors?.map(e => ({
        scheme: schemesWithActive[e.index]?.name,
        error: e.err.message
      })));
      throw err;
    });
    console.log(`✓ Inserted ${result.length} real schemes successfully`);
    
    // Verify insertion
    const count = await Scheme.countDocuments({ active: true });
    console.log(`✓ Total active schemes in database: ${count}`);
    
    mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding schemes:', error.message);
    if (error.writeErrors) {
      console.error('Write errors:', error.writeErrors);
    }
    process.exit(1);
  }
};

if (require.main === module) {
  seedSchemes();
}

module.exports = seedSchemes;
