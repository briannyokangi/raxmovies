const About = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            About RaxMovies
          </h1>
          <p className="text-xl text-slate-400">
            Discover, explore, and enjoy cinema like never before
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Mission Section */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              RaxMovies is a modern movie discovery and streaming platform designed to bring cinematic entertainment to your fingertips. We believe in making it simple, enjoyable, and accessible for everyone to discover their next favorite film.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our platform combines cutting-edge technology with an intuitive user experience, allowing you to browse thousands of movies, save your favorites, build watchlists, and share your thoughts through reviews.
            </p>
          </section>

          {/* What We Offer Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              What We Offer
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: '🎬',
                  title: 'Vast Movie Library',
                  description: 'Access to thousands of movies across all genres, from classics to the latest releases.'
                },
                {
                  icon: '❤️',
                  title: 'Personalization',
                  description: 'Save your favorite movies and create watchlists tailored to your preferences.'
                },
                {
                  icon: '⭐',
                  title: 'Community Reviews',
                  description: 'Read and write reviews to connect with other movie enthusiasts.'
                },
                {
                  icon: '🔍',
                  title: 'Smart Search',
                  description: 'Easily find movies by title, genre, cast, or other criteria.'
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-rose-500/50 transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Section */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              RaxMovies is built using the latest web technologies to ensure a fast, reliable, and enjoyable experience across all devices.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: 'React', description: 'Modern UI framework for interactive interfaces' },
                { name: 'Tailwind CSS', description: 'Utility-first styling for beautiful designs' },
                { name: 'Node.js & Express', description: 'Powerful backend for API and data management' },
                { name: 'MongoDB', description: 'Flexible database for storing movie data' },
                { name: 'TMDB API', description: 'Comprehensive movie database integration' },
                { name: 'Vercel', description: 'Fast and reliable cloud deployment' }
              ].map((tech, idx) => (
                <div key={idx} className="border-l-2 border-rose-500 pl-4">
                  <h4 className="font-semibold text-white">{tech.name}</h4>
                  <p className="text-sm text-slate-400">{tech.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why Choose RaxMovies?
            </h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✓</span>
                <span>Curated selection of movies from trusted sources</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✓</span>
                <span>User-friendly interface optimized for all devices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✓</span>
                <span>Fast, reliable, and secure platform</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✓</span>
                <span>Personalized recommendations and watchlists</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✓</span>
                <span>Active community of movie lovers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 mt-1">✓</span>
                <span>Continuous updates and new features</span>
              </li>
            </ul>
          </section>

          {/* CTA Section */}
          <section className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-pink-500/10 p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Explore Cinema?
            </h2>
            <p className="text-slate-300 mb-6">
              Start discovering your next favorite movie today
            </p>
            <a
              href="/movies"
              className="inline-block px-8 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all duration-300 active:scale-95"
            >
              Browse Movies
            </a>
          </section>
        </div>
      </div>
    </main>
  );
};

export default About;
