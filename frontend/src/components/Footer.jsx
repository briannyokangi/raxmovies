const Footer = () => (
  <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-4 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="text-rose-500">▶</span>
            RAXMovies
          </h3>
          <p className="text-sm">Your gateway to cinematic discoveries and entertainment.</p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition hover:text-rose-400">Home</a></li>
            <li><a href="/movies" className="hover:text-white transition hover:text-rose-400">Browse</a></li>
            <li><a href="/profile" className="hover:text-white transition hover:text-rose-400">Profile</a></li>
            <li><a href="/watchlist" className="hover:text-white transition hover:text-rose-400">Watchlist</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white transition hover:text-rose-400">About</a></li>
            <li><a href="/privacy" className="hover:text-white transition hover:text-rose-400">Privacy</a></li>
            <li><a href="/terms" className="hover:text-white transition hover:text-rose-400">Terms</a></li>
            <li><a href="/contact" className="hover:text-white transition hover:text-rose-400">Contact</a></li>
          </ul>
        </div>

        {/* Tech */}
        <div>
          <h4 className="text-white font-semibold mb-4">Tech Stack</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition">React & Vite</li>
            <li className="hover:text-white transition">Node.js & Express</li>
            <li className="hover:text-white transition">MongoDB</li>
            <li className="hover:text-white transition">Tailwind CSS</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-900 pt-8">
        {/* Links */}
        <div className="mb-6 flex flex-wrap justify-center gap-4 text-xs">
          <a href="/about" className="hover:text-rose-400 transition">About Us</a>
          <span className="text-slate-700">•</span>
          <a href="/privacy" className="hover:text-rose-400 transition">Privacy Policy</a>
          <span className="text-slate-700">•</span>
          <a href="/terms" className="hover:text-rose-400 transition">Terms of Service</a>
          <span className="text-slate-700">•</span>
          <a href="/contact" className="hover:text-rose-400 transition">Contact Us</a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm">© 2026 RaxMovies. All rights reserved.</p>
          <p className="mt-2 text-xs text-slate-500">Discover your next cinematic adventure with curated movies from TMDB.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
