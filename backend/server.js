const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const connectDB=require('./config/dbconfig');
const authRoutes=require('./routes/authRoutes');
const profileRoutes=require('./routes/profileRoutes');
const eligibilityRoutes=require('./routes/eligibilityRoutes');
const aiRoutes=require('./routes/aiRoutes');
const cors=require('cors');
const dotenv=require('dotenv');

dotenv.config();
connectDB();

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', {
    authorization: req.headers.authorization ? 'Present' : 'Missing',
    contentType: req.headers['content-type']
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/ai', aiRoutes);

app.get('/',(req,res)=>{
    res.send('Welcome to PolicyMate API');
})

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
});