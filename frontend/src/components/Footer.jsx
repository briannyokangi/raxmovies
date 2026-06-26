const Footer = () => (
  <footer className="bg-navy-950 border-t border-navy-800 text-gray-400">
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-4 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-sky-400 text-navy-950 font-bold text-sm">▶</span>
            <span className="gradient-text">RaxMovies</span>
          </h3>
          <p className="text-sm">Your gateway to premium streaming with AI-powered discoveries.</p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="btn-icon hover:text-sky-400" title="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
              </svg>
            </a>
            <a href="#" className="btn-icon hover:text-sky-400" title="GitHub">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="#" className="btn-icon hover:text-sky-400" title="Discord">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3671C18.7977 3.6368 17.147 3.1283 15.4019 2.84C15.191 3.2167 14.9494 3.7361 14.7823 4.1271C12.9075 3.8554 11.0363 3.8554 9.1659 4.1271C8.9988 3.7361 8.7563 3.2167 8.5455 2.84C6.8001 3.1283 5.1496 3.6368 3.6313 4.3671C0.533 8.3458 -0.0325662 12.2186 0.00251501 16.0402C1.83249 17.5228 3.61248 18.3866 5.36754 18.9746C5.80039 18.3574 6.1788 17.6999 6.48762 17.0077C5.70935 16.7515 4.95913 16.4089 4.23505 15.9852C4.36394 15.8746 4.49073 15.7582 4.6124 15.6388C7.78512 17.0076 11.3881 17.9502 15.1403 17.9502C18.8925 17.9502 22.4956 17.0076 25.6683 15.6388C25.79 15.7582 25.9167 15.8746 26.0456 15.9852C25.3215 16.4089 24.5714 16.7515 23.793 17.0077C24.1015 17.6999 24.4798 18.3574 24.9127 18.9746C26.6677 18.3866 28.4477 17.5228 30.2777 16.0402C30.3306 11.8859 29.1817 8.11957 26.1079 4.3671C26.1079 4.3671 25.0932 3.1283 20.317 4.3671Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-sky-400 transition">🏠 Home</a></li>
            <li><a href="/movies" className="hover:text-sky-400 transition">🎬 Browse Movies</a></li>
            <li><a href="/profile" className="hover:text-sky-400 transition">👤 Profile</a></li>
            <li><a href="/watchlist" className="hover:text-sky-400 transition">❤️ Watchlist</a></li>
          </ul>
        </div>

        {/* Legal & Info */}
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-sky-400 transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-sky-400 transition">Contact</a></li>
            <li><a href="/privacy" className="hover:text-sky-400 transition">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-sky-400 transition">Terms of Service</a></li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-white font-semibold mb-4">Built With</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition">React + Vite</li>
            <li className="hover:text-white transition">Node.js & Express</li>
            <li className="hover:text-white transition">MongoDB Atlas</li>
            <li className="hover:text-white transition">TMDB API</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-navy-800 pt-8">
        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">© 2026 RaxMovies Premium. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">Version 2.0.0 • Movie data powered by TMDB • Built with ❤️ for movie lovers</p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <span className="text-gray-600">Status: <span className="text-green-400">●</span> Online</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">API: <span className="text-sky-400">● Live</span></span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
