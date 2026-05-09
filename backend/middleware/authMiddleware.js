import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Login required. Token missing.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please login again.' });
  }
};
