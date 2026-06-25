const Privacy = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400">
            Last updated: June 25, 2026
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Introduction */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Your Privacy Matters to Us
            </h2>
            <p className="text-slate-300 leading-relaxed">
              At RaxMovies, we are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              1. Information We Collect
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Account Information',
                  description: 'When you create an account, we collect your username, email address, and password (encrypted). We never share your password with anyone.'
                },
                {
                  title: 'Movie Preferences',
                  description: 'We track your favorite movies, watchlist items, and reviews to personalize your experience and provide better recommendations.'
                },
                {
                  title: 'Usage Data',
                  description: 'We collect information about how you interact with our platform, including pages visited, search queries, and time spent on the site.'
                },
                {
                  title: 'Device Information',
                  description: 'We automatically collect information about your device, including IP address, browser type, operating system, and mobile device identifiers.'
                },
                {
                  title: 'Contact Information',
                  description: 'If you contact us through our contact form, we collect the name, email, and message you provide.'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              2. How We Use Your Information
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span>To create and maintain your user account</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span>To provide and improve our services</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span>To personalize your experience and provide recommendations</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span>To send you service-related announcements and updates</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span>To respond to your inquiries and customer support requests</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span>To analyze usage patterns and improve platform functionality</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span>To prevent fraud and ensure platform security</span>
              </p>
            </div>
          </section>

          {/* Cookies & Analytics */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              3. Cookies & Analytics
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                We use cookies and similar tracking technologies to enhance your user experience. Cookies are small files stored on your device that help us remember your preferences and track usage patterns.
              </p>
              <p className="text-slate-300">
                We use analytics tools like Google Analytics to understand how users interact with our platform. This helps us identify trends, optimize performance, and improve features.
              </p>
              <p className="text-slate-300">
                You can control cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our platform.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              4. Data Security
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                We implement industry-standard security measures to protect your personal information, including:
              </p>
              <ul className="space-y-2">
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span>SSL/TLS encryption for data in transit</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span>Secure password hashing and storage</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span>Restricted access to personal information</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span>Compliance with data protection regulations</span>
                </li>
              </ul>
              <p className="text-slate-300 text-sm italic mt-4">
                However, no method of transmission over the internet is completely secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              5. Third-Party Services
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                Our platform integrates with third-party services to provide you with better content and functionality:
              </p>
              <ul className="space-y-3">
                <li className="text-slate-300">
                  <strong className="text-white">TMDB API:</strong> We use The Movie Database API to retrieve movie information, ratings, and images.
                </li>
                <li className="text-slate-300">
                  <strong className="text-white">Google Analytics:</strong> We use Google Analytics to track usage patterns and improve platform performance.
                </li>
                <li className="text-slate-300">
                  <strong className="text-white">Vercel:</strong> Our platform is hosted on Vercel, which may collect server logs and analytics data.
                </li>
              </ul>
              <p className="text-slate-300">
                These third-party services have their own privacy policies. We recommend reviewing them to understand how they handle your information.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              6. Your Rights
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span><strong className="text-white">Access:</strong> You have the right to access your personal information at any time through your profile</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span><strong className="text-white">Modify:</strong> You can update your account information and preferences</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span><strong className="text-white">Delete:</strong> You can request deletion of your account and associated data</span>
              </p>
              <p className="text-slate-300 flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span><strong className="text-white">Opt-out:</strong> You can opt-out of receiving promotional communications</span>
              </p>
            </div>
          </section>

          {/* Policy Changes */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Changes to This Privacy Policy
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, and other factors. We will notify you of any material changes by updating the "Last updated" date at the top of this page and, when necessary, by email.
            </p>
          </section>

          {/* Contact Section */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Contact Us
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="space-y-2">
              <p className="text-slate-300">
                <strong className="text-white">Email:</strong> privacy@raxmovies.com
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Support:</strong> support@raxmovies.com
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Contact Form:</strong> <a href="/contact" className="text-rose-500 hover:text-rose-400 transition">Available here</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
