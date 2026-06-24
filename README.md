# RaxMovies

A full-stack movie discovery platform built with React, Tailwind CSS, Node.js, Express, MongoDB, and JWT authentication.

## Features

- User registration and login
- JWT-secured API
- Browse, search and filter movies
- Movie details, reviews, and favorites
- Admin controls for movie management
- Responsive cinematic UI

## Project structure

- `frontend/` — React web app
- `backend/` — Express API with MongoDB

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/raxmovies
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Use application

Open `http://localhost:3000` for frontend and `http://localhost:5000` for API.

### Admin role setup

- The first account registered becomes the initial admin automatically.
- Admin dashboard is available at `http://localhost:3000/admin` after login.
- Admins can add movies, manage user roles, and moderate reviews.

### Admin notes

- If you already have users and need to promote a new admin manually, update the user's `role` field in MongoDB to `admin`.
- Use `frontend/.env` to set `VITE_API_URL` for production.

## Deployment

### Option A — Separate frontend and backend deployments

1. Deploy the backend API separately.
   - Host on Render, Heroku, Fly.io, Railway, or any Node.js provider.
   - Set production environment variables in the host dashboard or `.env`:
     - `MONGO_URI` to your MongoDB Atlas/hosted database
     - `JWT_SECRET` to a strong secret
     - `PORT` if required by the host
   - Start with `npm install` and `npm start` in `backend/`.

2. Build and deploy the frontend separately.
   - Set `VITE_API_URL` to your deployed backend API URL with `/api` appended, for example:
     - `https://api.example.com/api`
   - Use `frontend/.env.production` or the chosen host's environment settings.
   - Build with `cd frontend && npm install && npm run build`.
   - Deploy the generated `frontend/dist` folder to Vercel, Netlify, Cloudflare Pages, or another static host.

3. Confirm cross-origin requests work.
   - Backend already enables CORS for all origins by default.
   - Frontend will call the backend via the configured `VITE_API_URL`.

### Recommended production setup

- `backend`: Node.js server running `npm start`
- `frontend`: static hosting for the Vite build artifacts
- `database`: MongoDB Atlas or equivalent managed MongoDB service

- Backend API endpoint example: `https://api.example.com/api`
- Frontend app endpoint example: `https://raxmovies.example.com`

## Notes

- Add admin users manually by setting `role: 'admin'` in MongoDB.
- Adjust `VITE_API_URL` in `frontend/.env` for production API URL.
