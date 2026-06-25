import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
