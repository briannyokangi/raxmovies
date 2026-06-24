# RaxMovies Upgrade Guide - TMDB API Integration

## Overview
This guide covers the complete upgrade of RaxMovies with TMDB API integration, enabling access to thousands of real movies while maintaining your custom user data (reviews, watchlists, favorites).

## Architecture
```
Frontend (Vercel)
    ↓
Backend API (Render)
    ├── MongoDB (User data: accounts, favorites, watchlists, reviews)
    └── TMDB API (Movie data: search, trending, popular, details)
```

---

## Backend Setup

### 1. Environment Variables

Create `.env` file in `/backend` directory:

```env
# Node Environment
NODE_ENV=development

# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/raxmovies?retryWrites=true&w=majority

# JWT Secret (min 32 characters)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# TMDB API Key (get from https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here

# Frontend URL for CORS
FRONTEND_URL=https://raxmovies.vercel.app
```

### 2. Get TMDB API Key

1. Go to https://www.themoviedb.org/settings/api
2. Log in or create an account
3. Request an API key
4. Accept terms and submit
5. Copy your API key to `.env`

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. New Files Created

- `backend/services/tmdbService.js` - TMDB API integration layer
- `backend/.env.example` - Template for environment variables

### 5. Updated Files

- `backend/controllers/movieController.js` - Now uses TMDB API for search, featured, and popular movies
- `backend/server.js` - Enhanced CORS configuration for Vercel
- `backend/package.json` - Added axios dependency

### 6. Local Development

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`

---

## Frontend Setup

### 1. Environment Variables

Create `.env` file in `/frontend` directory:

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Or for production (deployed backend)
VITE_API_URL=https://raxmovies.onrender.com/api
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. New/Updated Files

- `frontend/src/services/api.js` - Enhanced API service with organized endpoints
- `frontend/src/pages/Home.jsx` - Displays featured and popular TMDB movies
- `frontend/src/pages/Movies.jsx` - Search and browse with pagination
- `frontend/src/pages/MovieDetails.jsx` - Shows TMDB movie details with local reviews
- `frontend/src/components/MovieCard.jsx` - Handles both TMDB and local movie formats

### 4. Local Development

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Deployment on Render (Backend)

### 1. Connect GitHub Repository

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select the repository

### 2. Configure Render Service

- **Name**: raxmovies-backend
- **Region**: Choose closest region
- **Branch**: main
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### 3. Add Environment Variables

In Render dashboard, add under "Environment":

```
NODE_ENV=production
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
TMDB_API_KEY=<your_tmdb_api_key>
FRONTEND_URL=https://<your-frontend>.vercel.app
```

### 4. Deploy

Push to main branch:
```bash
git push -u origin main
```

Render automatically deploys. Check logs at https://dashboard.render.com

**Backend URL**: `https://raxmovies.onrender.com`

---

## Deployment on Vercel (Frontend)

### 1. Connect GitHub Repository

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### 2. Configure Project

- **Framework Preset**: Vite
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Add Environment Variables

In Vercel dashboard settings, add:

```
VITE_API_URL=https://raxmovies.onrender.com/api
```

### 4. Deploy

Push to main branch:
```bash
git push -u origin main
```

Vercel automatically deploys.

**Frontend URL**: `https://raxmovies.vercel.app`

---

## API Endpoints

### Movies
- `GET /api/movies` - Search movies (query: `search`, `genre`, `page`)
- `GET /api/movies/featured` - Get trending movies
- `GET /api/movies/popular` - Get popular movies (query: `page`)
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies/:id/favorite` - Toggle favorite
- `POST /api/movies/:id/watchlist` - Toggle watchlist

### Reviews
- `GET /api/reviews/:movieId` - Get reviews for a movie
- `POST /api/reviews/:movieId` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

---

## TMDB Integration Details

### Movie Fields Returned

```javascript
{
  id: 123,                    // TMDB ID
  title: "Movie Title",
  overview: "Movie description",
  poster_path: "/path/to/poster.jpg",
  backdrop_path: "/path/to/backdrop.jpg",
  posterUrl: "full_url_to_poster",
  backdropUrl: "full_url_to_backdrop",
  release_date: "2024-01-01",
  vote_average: 8.5,
  popularity: 1234.5,
  genres: [{ id: 28, name: "Action" }],
  runtime: 120,
  budget: 100000000,
  revenue: 500000000,
  credits: { cast: [...], crew: [...] }
}
```

### Search Features

1. **Text Search** - Search movies by title
2. **Trending** - Get trending movies (weekly)
3. **Popular** - Get most popular movies
4. **Genre Discovery** - Filter by TMDB genre IDs
5. **Pagination** - Up to 1000 pages of results

### Image URLs

All image URLs are constructed as:
```
https://image.tmdb.org/t/p/{size}/{path}
```

Available sizes: `w342`, `w500`, `w780`, `original`

---

## Testing Checklist

### Backend Tests
- [ ] Start server: `npm run dev`
- [ ] Check health: `curl http://localhost:5000/api/health`
- [ ] Test search: `GET /api/movies?search=avengers`
- [ ] Test featured: `GET /api/movies/featured`
- [ ] Test popular: `GET /api/movies/popular`
- [ ] Test details: `GET /api/movies/550` (Fight Club TMDB ID)

### Frontend Tests
- [ ] Start dev server: `npm run dev`
- [ ] Home page loads featured movies
- [ ] Home page loads popular movies
- [ ] Search works and displays results
- [ ] Pagination works on Movies page
- [ ] Movie details page displays correctly
- [ ] Reviews can be submitted (when logged in)
- [ ] Favorites and watchlist work (when logged in)

### Deployment Tests
- [ ] Backend runs on Render
- [ ] Frontend runs on Vercel
- [ ] CORS works (no blocked requests)
- [ ] All API endpoints respond
- [ ] Images load properly from TMDB
- [ ] Search functionality works end-to-end
- [ ] Reviews persist in MongoDB

---

## Troubleshooting

### CORS Errors
**Problem**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: 
1. Check `FRONTEND_URL` in backend `.env`
2. Verify `VITE_API_URL` in frontend `.env`
3. Restart backend server

### TMDB API Errors
**Problem**: "Failed to search movies"

**Solution**:
1. Verify `TMDB_API_KEY` is set in `.env`
2. Check API key is valid at https://www.themoviedb.org/settings/api
3. Verify request limits (TMDB has rate limits)

### MongoDB Connection
**Problem**: "Cannot connect to MongoDB"

**Solution**:
1. Verify `MONGO_URI` is correct
2. Check IP whitelist in MongoDB Atlas
3. Verify credentials and database exists

### Images Not Loading
**Problem**: TMDB poster/backdrop images are broken

**Solution**:
1. Verify image URLs are constructed correctly
2. Check TMDB service is being called
3. Verify `posterUrl` and `backdropUrl` fields are populated

---

## Performance Optimization

### Caching Recommendations
- Cache TMDB responses in Redis (30 min TTL)
- Cache user favorites/watchlist in MongoDB
- Use CDN for image delivery

### Rate Limiting
- TMDB free tier: 40 requests per 10 seconds
- Implement request queuing in production
- Add error handling for rate limits

### Database Optimization
- Index user emails for faster auth lookups
- Index movieId for faster review queries
- Create compound indexes for common filters

---

## Next Steps

1. **Add More Features**:
   - User profiles with profile pictures
   - Social features (follow users, share reviews)
   - Advanced filtering and search
   - Recommendation engine

2. **Enhanced TMDB Integration**:
   - Movie trailers from TMDB videos
   - Actor profiles and filmography
   - Collection/franchise information
   - Multi-language support

3. **Performance**:
   - Implement caching layer
   - Add image optimization
   - Database query optimization
   - Frontend code splitting

4. **Monitoring**:
   - Set up error tracking (Sentry)
   - Add analytics
   - Monitor API performance
   - Track user behavior

---

## Support

For TMDB API documentation: https://developer.themoviedb.org/
For Render deployment: https://render.com/docs
For Vercel deployment: https://vercel.com/docs
