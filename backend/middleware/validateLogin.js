const { body, validationResult } = require('express-validator');

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        error: true,
      });
    }
    next();
  },
];

module.exports = validateLogin;
