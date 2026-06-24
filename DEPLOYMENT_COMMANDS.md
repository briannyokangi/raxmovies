# RaxMovies - Git & Deployment Commands

## 📝 Commit Current Changes

```bash
# From project root
cd /path/to/RAX\ online\ mov

# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "feat: integrate TMDB API for movie data

- Add TMDB service layer for movie search, trending, popular, and details
- Update movieController to use TMDB API while keeping MongoDB for user data
- Enhance CORS configuration for Vercel deployment
- Add axios dependency for HTTP requests
- Update frontend components to work with TMDB data format
- Add featured and popular movie sections
- Implement movie search with pagination
- Update MovieDetails to show TMDB movie information
- Reorganize API service with grouped endpoints
- Create environment variable templates"

# Push to GitHub
git push -u origin main
```

---

## 🚀 Deploy to Render (Backend)

### First Time Setup

```bash
# 1. Make sure all changes are committed and pushed
git push -u origin main

# 2. Go to Render.com dashboard
# 3. Click "New +" → "Web Service"
# 4. Connect GitHub account
# 5. Select your repository
# 6. Configure:
#    - Name: raxmovies-backend
#    - Runtime: Node
#    - Build Command: cd backend && npm install
#    - Start Command: cd backend && npm start
#
# 7. Add Environment Variables (in Render dashboard):
#    NODE_ENV=production
#    MONGO_URI=<your-mongodb-uri>
#    JWT_SECRET=<your-jwt-secret>
#    TMDB_API_KEY=<your-tmdb-key>
#    FRONTEND_URL=https://your-frontend-domain.vercel.app
#
# 8. Click "Create Web Service"
# 9. Render automatically deploys and shows logs
```

### Update Existing Render Deployment

```bash
# 1. Commit and push changes
git add .
git commit -m "backend: update TMDB integration"
git push origin main

# 2. Render automatically redeploys
# 3. Monitor in Render dashboard under "Logs"
# 4. New deployment URL shown in "Environments"
```

### Check Render Deployment

```bash
# Test health endpoint
curl https://raxmovies.onrender.com/api/health

# Test search
curl "https://raxmovies.onrender.com/api/movies?search=avatar"

# Test featured
curl https://raxmovies.onrender.com/api/movies/featured
```

---

## 🌐 Deploy to Vercel (Frontend)

### First Time Setup

```bash
# 1. Make sure all changes are committed and pushed
git push -u origin main

# 2. Go to Vercel.com
# 3. Click "Add New" → "Project"
# 4. Import Git Repository
# 5. Select your repository
# 6. Configure:
#    - Project Name: raxmovies
#    - Framework: Vite
#    - Root Directory: ./frontend
#    - Build Command: npm run build
#    - Output Directory: dist
#    - Install Command: npm install
#
# 7. Add Environment Variable:
#    VITE_API_URL = https://raxmovies.onrender.com/api
#
# 8. Click "Deploy"
# 9. Vercel automatically builds and deploys
```

### Update Existing Vercel Deployment

```bash
# 1. Commit and push changes
git add .
git commit -m "frontend: update TMDB integration"
git push origin main

# 2. Vercel automatically redeploys
# 3. Monitor in Vercel dashboard
# 4. Production URL shown in dashboard
```

### Preview Deployment Locally

```bash
cd frontend
npm run build
npm run preview
# Opens at http://localhost:5173
```

---

## 🔄 Full Deployment Flow

### Step 1: Backend Deployment

```bash
# 1. Stage changes
git add backend/

# 2. Commit
git commit -m "backend: TMDB integration complete"

# 3. Push
git push origin main

# 4. Wait for Render to automatically deploy (2-5 min)
#    Monitor at: https://dashboard.render.com

# 5. Verify
curl https://raxmovies.onrender.com/api/health
# Expected: {"status":"OK","timestamp":"..."}
```

### Step 2: Frontend Deployment

```bash
# 1. Update VITE_API_URL to production backend
#    File: frontend/.env
#    VITE_API_URL=https://raxmovies.onrender.com/api

# 2. Stage changes
git add frontend/

# 3. Commit
git commit -m "frontend: TMDB integration and production config"

# 4. Push
git push origin main

# 5. Wait for Vercel to automatically deploy (1-3 min)
#    Monitor at: https://vercel.com/dashboard

# 6. Visit your frontend URL from Vercel dashboard
```

---

## 🔍 Monitoring Deployments

### Render Dashboard
```
https://dashboard.render.com
→ Select service
→ View Logs tab
→ Recent Activity tab
→ Deployments tab
```

### Vercel Dashboard
```
https://vercel.com/dashboard
→ Select project
→ View Deployments tab
→ View Preview Deployments
→ View Production Deployments
```

---

## 🆘 Rollback Commands

### Rollback Render to Previous Deployment

```bash
# 1. Go to Render dashboard
# 2. Select service
# 3. Click "Deployments"
# 4. Find previous successful deployment
# 5. Click "Redeploy"
```

### Rollback Vercel to Previous Deployment

```bash
# 1. Go to Vercel dashboard
# 2. Select project
# 3. Click "Deployments"
# 4. Find previous successful deployment
# 5. Click "Promote to Production"
```

### Rollback Git to Previous Commit

```bash
# View commit history
git log --oneline

# Revert to specific commit
git revert <commit-hash>

# Or force reset (use with caution)
git reset --hard <commit-hash>
git push -f origin main
```

---

## 📱 Environment Variables Checklists

### Backend Environment Variables

```env
# Required
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/raxmovies
JWT_SECRET=your_very_long_secret_key_at_least_32_characters
TMDB_API_KEY=your_tmdb_api_key_from_themoviedb_org

# Optional
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend Environment Variables

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://raxmovies.onrender.com/api
```

---

## 🧪 Post-Deployment Tests

### Backend Tests

```bash
BACKEND_URL="https://raxmovies.onrender.com"

# Test 1: Health check
curl $BACKEND_URL/api/health

# Test 2: Search movies
curl "$BACKEND_URL/api/movies?search=avatar"

# Test 3: Get featured
curl $BACKEND_URL/api/movies/featured

# Test 4: Get popular
curl $BACKEND_URL/api/movies/popular

# Test 5: Get movie details
curl $BACKEND_URL/api/movies/550  # Fight Club

# All tests should return JSON with no CORS errors
```

### Frontend Tests

```bash
FRONTEND_URL="https://your-project.vercel.app"

# Open in browser and test:
# 1. Home page loads featured movies
# 2. Home page loads popular movies
# 3. Search bar works and shows results
# 4. Movies page displays correctly
# 5. Pagination works
# 6. Movie details page loads
# 7. Reviews can be submitted (if logged in)
# 8. Favorites/watchlist work (if logged in)
```

---

## 📊 Useful Git Commands

```bash
# Show commit history
git log --oneline -10

# Show changes in working directory
git diff

# Show staged changes
git diff --staged

# Show changes in specific file
git diff frontend/src/pages/Home.jsx

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature

# Force push (use with caution!)
git push -f origin main

# Stash changes
git stash

# Apply stashed changes
git stash apply
```

---

## 📞 Troubleshooting Deployments

### Render Build Fails

```bash
# 1. Check build logs in Render dashboard
# 2. Common issues:
#    - Missing dependencies: npm install fails
#    - Wrong build command: cd backend && npm install
#    - Wrong start command: cd backend && npm start
# 3. Fix in code and push again
git push origin main
# Render automatically rebuilds
```

### Vercel Build Fails

```bash
# 1. Check build logs in Vercel dashboard
# 2. Common issues:
#    - Missing environment variables
#    - Wrong root directory (should be ./frontend)
#    - Build command issues
# 3. Fix environment variables in Vercel Settings
# 4. Or fix code and push:
git push origin main
# Vercel automatically rebuilds
```

### CORS Errors After Deployment

```bash
# 1. Check FRONTEND_URL in backend .env
# 2. Should match your Vercel frontend URL exactly
# 3. Restart Render service to pick up new env var
# 4. Clear browser cache (Ctrl+Shift+Delete)
```

### Images Not Loading

```bash
# Check browser console for image errors
# TMDB image URLs should look like:
# https://image.tmdb.org/t/p/w500/path/to/image.jpg

# If broken:
# 1. Verify TMDB_API_KEY is valid
# 2. Check movie has poster_path in TMDB
# 3. Check posterUrl is being set in movieController
```

---

## 🎯 Performance Optimization Commands

```bash
# Build frontend for production
npm run build

# Check build size
du -sh frontend/dist

# Preview production build locally
npm run preview

# Run backend in production mode
NODE_ENV=production npm start
```

---

## 📚 Useful Resources

**Render Documentation**
- Deployment: https://render.com/docs
- Environment Variables: https://render.com/docs/configure-environment
- Logs: https://render.com/docs/logging

**Vercel Documentation**
- Deployment: https://vercel.com/docs
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Build Settings: https://vercel.com/docs/concepts/deployments/configure-a-build

**Git & GitHub**
- Git Docs: https://git-scm.com/doc
- GitHub: https://github.com

**TMDB**
- API Docs: https://developer.themoviedb.org/
- API Keys: https://www.themoviedb.org/settings/api
