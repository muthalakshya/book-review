// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    // console.log(authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    // Add user to request object
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (error) {
    console.log('Auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default authUser;