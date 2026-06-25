const Terms = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Terms of Service
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
              1. Agreement to Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using the RaxMovies website and platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, please do not use our platform.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              2. User Responsibilities
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Account Creation',
                  description: 'You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your password with others and to notify us immediately of any unauthorized access.'
                },
                {
                  title: 'Accurate Information',
                  description: 'You agree to provide accurate and complete information when creating your account and to keep this information updated.'
                },
                {
                  title: 'Lawful Use',
                  description: 'You agree to use RaxMovies only for lawful purposes and in accordance with these Terms. You will not engage in any conduct that restricts or inhibits anyone\'s use or enjoyment of the Service.'
                },
                {
                  title: 'Prohibited Conduct',
                  description: 'You agree not to engage in harassment, illegal activities, sharing copyrighted content without permission, or attempting to gain unauthorized access to our systems.'
                },
                {
                  title: 'Content Responsibility',
                  description: 'You are responsible for all content you upload, post, or share on RaxMovies. You agree not to share content that is illegal, defamatory, or violates third-party rights.'
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

          {/* Content Availability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              3. Content Availability & Changes
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                <strong className="text-white">Movie Library:</strong> RaxMovies provides access to a curated selection of movies. The availability of specific movies may change at any time due to licensing agreements and provider changes.
              </p>
              <p className="text-slate-300">
                <strong className="text-white">No Warranty:</strong> We provide the Service on an "as-is" basis. We do not guarantee that all movies will be continuously available or that our platform will be error-free.
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Service Changes:</strong> We reserve the right to modify, update, or discontinue any portion of RaxMovies at any time without notice.
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Streaming Quality:</strong> Streaming quality may vary based on your internet connection and device capabilities. We do not guarantee specific video quality or resolution.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              4. Intellectual Property Rights
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                All content on RaxMovies, including design, graphics, text, and code, is the property of RaxMovies or its content suppliers and is protected by international copyright laws.
              </p>
              <p className="text-slate-300">
                Movie data and images are provided by The Movie Database (TMDB) under their API terms. You may not download, reproduce, or distribute this content without proper authorization.
              </p>
              <p className="text-slate-300">
                Your user-generated content (reviews, ratings) remains your property, but you grant RaxMovies a license to use and display this content on our platform.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              5. Limitation of Liability
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                In no event shall RaxMovies be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
              <p className="text-slate-300">
                We are not responsible for:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Service interruptions or unavailability</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Loss of data or corrupted files</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Any harm caused by third-party services or content</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Results from your use of the platform</span>
                </li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              6. User Accounts & Termination
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in unauthorized activity.
              </p>
              <p className="text-slate-300">
                Upon account termination, your access to the Service will be immediately revoked, and you will lose access to your watchlist, favorites, and reviews.
              </p>
              <p className="text-slate-300">
                You may delete your account at any time through your profile settings. Once deleted, your data will be removed from our systems within 30 days.
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              7. Third-Party Links & Services
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                RaxMovies may contain links to third-party websites and services. We are not responsible for the content, accuracy, or practices of these external sites.
              </p>
              <p className="text-slate-300">
                Your use of third-party services is governed by their respective terms and privacy policies. We encourage you to review these before using them.
              </p>
              <p className="text-slate-300">
                We integrate with The Movie Database (TMDB) API. Their terms of service apply to the use of their content.
              </p>
            </div>
          </section>

          {/* Fees & Payment */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              8. Fees & Payment
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                RaxMovies currently provides free access to our platform and movie library. If we introduce paid features or premium subscriptions in the future, you will be notified in advance.
              </p>
              <p className="text-slate-300">
                Any paid services will be subject to additional terms and payment conditions that we will provide at that time.
              </p>
            </div>
          </section>

          {/* DMCA & Copyright */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              9. Copyright & DMCA
            </h2>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <p className="text-slate-300">
                RaxMovies respects intellectual property rights. If you believe that your work has been infringed, please contact us with:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Identification of the copyrighted work</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Location of the infringing material</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Your contact information</span>
                </li>
                <li className="text-slate-300 flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>A statement of good faith belief of infringement</span>
                </li>
              </ul>
              <p className="text-slate-300">
                Email: copyright@raxmovies.com
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We may update these Terms of Service from time to time. Any changes will be posted on this page with an updated "Last updated" date. Your continued use of RaxMovies after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              11. Governing Law
            </h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction where RaxMovies is based, without regard to its conflict of law principles.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              12. Contact Us
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="space-y-2">
              <p className="text-slate-300">
                <strong className="text-white">Email:</strong> legal@raxmovies.com
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Support:</strong> support@raxmovies.com
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Contact Form:</strong> <a href="/contact" className="text-rose-500 hover:text-rose-400 transition">Available here</a>
              </p>
            </div>
          </section>

          {/* Acceptance */}
          <div className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-pink-500/10 p-8 md:p-10 text-center">
            <p className="text-slate-300 leading-relaxed">
              By using RaxMovies, you acknowledge that you have read these Terms of Service and agree to be bound by them. If you do not agree, please refrain from using our platform.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Terms;
