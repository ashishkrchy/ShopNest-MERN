const jwt = require('jsonwebtoken');

const authTokenMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
        error: true,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (err) {

    let message = 'Invalid token. Authentication failed.';

    if (err.name === 'TokenExpiredError') {
      message = 'Session expired. Please log in again.';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token. Please provide a valid token.';
    }

    return res.status(403).json({ message, error: true });
  }
};

module.exports = authTokenMiddleware;
