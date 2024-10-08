
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
require('dotenv').config();
const xssClean = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');


const app = express();

// Protect against XSS attacks, should come before any routes
app.use(xssClean());


// Protect against HPP, should come before any routes
app.use(hpp());
// Enable 'trust proxy'
app.set('trust proxy', 1); // or the number of proxies your app is behind

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
  res.json('hello world')
})
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/buyer', buyerRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
