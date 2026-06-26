const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MONGO_URI = process.env.MONGO_URI;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!MONGO_URI) {
  console.error('✗ MONGO_URI is not defined in backend/.env');
  process.exit(1);
}

if (!TMDB_API_KEY) {
  console.error('✗ TMDB_API_KEY is not defined in backend/.env');
  process.exit(1);
}

console.log('✓ Loaded backend/.env');
console.log('✓ MongoDB URI is present');
console.log('✓ TMDB API key is present');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { sampleMovies } = require('./data/sampleMovies');

const app = express();

// CORS Configuration for Vercel Frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://raxmovies-frontend.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request Origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: global.dbConnected ? 'connected' : 'fallback',
    sampleMovies: sampleMovies.length,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

mongoose.set('strictQuery', false);

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    global.dbConnected = true;
    console.log('✓ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    global.dbConnected = false;
    console.error('✗ MongoDB connection error, Atlas unavailable');
    console.error('Error message:', error.message);
    console.log('⚠ Starting backend in local fallback mode with sample data.');
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('✓ Using sample data (TMDB available)');
    });
  });

module.exports = app;
