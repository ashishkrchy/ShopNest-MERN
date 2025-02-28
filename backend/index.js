const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const userCartRoutes = require('./routes/userCartRoutes');
const searchRoutes = require('./routes/searchRoutes');
const filterProductRoutes = require('./routes/filterProductRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const paymentRoutes = require('./routes/paymentRoutes.js');
const updateProfileRoutes = require('./routes/updateProfileRoutes.js');

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', userCartRoutes);
app.use('/api', searchRoutes);
app.use('/api', filterProductRoutes);

app.use('/api', paymentRoutes);
app.use('/api', orderRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', updateProfileRoutes);

// Start Server after DB Connection
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
