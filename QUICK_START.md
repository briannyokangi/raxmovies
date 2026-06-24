# RaxMovies - Quick Start Guide

## 🚀 5-Minute Setup

### Backend (Local)

```bash
# 1. Navigate to backend
cd backend

# 2. Create .env file with:
# - TMDB_API_KEY from https://www.themoviedb.org/settings/api
# - MongoDB URI
# - JWT_SECRET (any 32+ char string)

# 3. Install & run
npm install
npm run dev
```

✅ Backend ready at `http://localhost:5000`

### Frontend (Local)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Create .env with:
# VITE_API_URL=http://localhost:5000/api

# 3. Install & run
npm install
npm run dev
```

✅ Frontend ready at `http://localhost:5173`

---

## 🎬 What's New

| Feature | Before | After |
|---------|--------|-------|
| **Movies** | Limited local DB | Thousands from TMDB |
| **Search** | Local regex search | TMDB full-text search |
| **Trending** | Manual list | TMDB trending weekly |
| **Details** | Basic info | Rich TMDB data |
| **Cast** | Comma-separated text | TMDB actor data |
| **Reviews** | Local only | Local + TMDB ratings |

---

## 🔑 Key API Changes

### Search Movies
```javascript
// Frontend
import { movieAPI } from '@/services/api';
const { data } = await movieAPI.searchMovies('avatar', 1);
// Returns: { movies: [...], totalPages: 50, totalResults: 1234 }
```

### Get Featured Movies
```javascript
const { data } = await movieAPI.getFeaturedMovies();
// Returns: { movies: [trending TMDB movies] }
```

### Get Movie Details
```javascript
const { data } = await movieAPI.getMovie(550); // Fight Club TMDB ID
// Returns: { movie: {...}, reviews: [...], similar: [...] }
```

---

## 📦 Files Changed

### Backend
- ✅ `backend/controllers/movieController.js` - TMDB integration
- ✅ `backend/services/tmdbService.js` - NEW TMDB client
- ✅ `backend/server.js` - Enhanced CORS
- ✅ `backend/package.json` - Added axios

### Frontend
- ✅ `frontend/src/services/api.js` - Organized endpoints
- ✅ `frontend/src/pages/Home.jsx` - Featured & popular movies
- ✅ `frontend/src/pages/Movies.jsx` - Search with pagination
- ✅ `frontend/src/pages/MovieDetails.jsx` - TMDB-aware
- ✅ `frontend/src/components/MovieCard.jsx` - Flexible format
- ✅ `frontend/.env.example` - Template

---

## 🌍 Environment Variables

### Backend `.env`
```env
TMDB_API_KEY=your_api_key
MONGO_URI=mongodb+srv://...
JWT_SECRET=min_32_chars
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Quick Tests

```bash
# Test backend
curl http://localhost:5000/api/health

# Search movies
curl "http://localhost:5000/api/movies?search=avatar"

# Get featured
curl http://localhost:5000/api/movies/featured

# Get movie details (TMDB ID)
curl http://localhost:5000/api/movies/550
```

---

## 🚢 Deploy to Render + Vercel

### Backend Render
1. Push to GitHub
2. Connect Render to repo
3. Set environment variables
4. Deploy runs automatically

Backend: `https://raxmovies.onrender.com`

### Frontend Vercel
1. Push to GitHub
2. Import project on Vercel
3. Set `VITE_API_URL` env var
4. Deploy runs automatically

Frontend: `https://raxmovies.vercel.app`

---

## ❓ Common Issues

| Issue | Fix |
|-------|-----|
| CORS errors | Check `FRONTEND_URL` in backend `.env` |
| No movies | Verify `TMDB_API_KEY` is valid |
| Broken images | Check `posterUrl` fields in response |
| Movies not searching | Verify backend is running |
| Auth issues | Check JWT_SECRET consistency |

---

## 📚 Documentation

- **Full Guide**: `UPGRADE_GUIDE.md`
- **TMDB API**: https://developer.themoviedb.org/
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

## 🎯 Next Steps

1. Get TMDB API key (2 min)
2. Set up .env files
3. Run `npm install` in both folders
4. Start servers with `npm run dev`
5. Test at http://localhost:5173

Happy coding! 🎬✨
