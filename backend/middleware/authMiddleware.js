const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  console.log('=== Auth Middleware ===');
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid Bearer token found');
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  console.log('Token found, length:', token.length);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, decoded:', decoded);
    req.user = { id: decoded.id }; // { id: ... }
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { verifyToken };
