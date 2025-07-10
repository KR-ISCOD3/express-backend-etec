import jwt from 'jsonwebtoken';

export function authenticateJWT(req, res, next) {

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Malformed Authorization header' });

  const secret = process.env.JWT_SECRET_ACCESS;
  if (!secret) return res.status(500).json({ message: 'Missing JWT secret' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// Example role-based access middleware
export function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  };
}


