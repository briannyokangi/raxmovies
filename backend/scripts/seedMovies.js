const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const { sampleMovies } = require('../data/sampleMovies');

dotenv.config();

const seedMovies = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/raxmovies';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const existingCount = await Movie.countDocuments();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing movies. Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  await Movie.insertMany(sampleMovies);
  console.log(`Seeded ${sampleMovies.length} sample movies.`);
  await mongoose.disconnect();
};

seedMovies().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
