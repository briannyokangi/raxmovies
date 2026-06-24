const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    trailer: { type: String, required: true },
    genre: { type: [String], required: true },
    year: { type: Number, required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 10, default: 0 },
    reviewCount: { type: Number, default: 0 },
    director: { type: String, default: '' },
    language: { type: String, default: 'English' },
    cast: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', MovieSchema);
