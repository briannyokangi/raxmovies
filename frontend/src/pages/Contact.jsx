import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      // In production, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-400">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h2>

              {submitted && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200">
                  <p className="font-semibold">✓ Message received!</p>
                  <p className="text-sm mt-1">Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-rose-500 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-rose-500 transition"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-rose-500 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us what you think..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-rose-500 transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold transition-all duration-300 active:scale-95"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Get in Touch
              </h2>

              {/* Email */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-rose-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <p className="text-slate-400">support@raxmovies.com</p>
                    <p className="text-slate-400">privacy@raxmovies.com</p>
                    <p className="text-sm text-slate-500 mt-2">
                      We typically respond within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-rose-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Support</h3>
                    <p className="text-slate-400">Help Center & FAQ</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Find answers to common questions about RaxMovies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-rose-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🌐</div>
                  <div>
                    <h3 className="font-semibold text-white mb-3">Follow Us</h3>
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-all duration-300"
                        title="Twitter"
                      >
                        𝕏
                      </a>
                      <a
                        href="#"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-all duration-300"
                        title="Facebook"
                      >
                        f
                      </a>
                      <a
                        href="#"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-all duration-300"
                        title="Instagram"
                      >
                        📷
                      </a>
                      <a
                        href="#"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-all duration-300"
                        title="YouTube"
                      >
                        ▶️
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-rose-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🕐</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Response Time</h3>
                    <p className="text-slate-400">Available 24/7</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Our support team is available around the clock.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10">
            <h2 className="text-2xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I reset my password?',
                  a: 'Visit the login page and click "Forgot Password". Follow the instructions sent to your email.'
                },
                {
                  q: 'Can I download movies for offline viewing?',
                  a: 'Currently, RaxMovies is a streaming-only platform. Movies are available to stream online only.'
                },
                {
                  q: 'How often is the movie library updated?',
                  a: 'Our library is updated regularly with new movies and content. Check back frequently for new additions!'
                },
                {
                  q: 'Is RaxMovies available on mobile devices?',
                  a: 'Yes! RaxMovies is fully responsive and works on all mobile devices, tablets, and desktops.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border-l-2 border-rose-500 pl-4 pb-4">
                  <h3 className="font-semibold text-white mb-1">{faq.q}</h3>
                  <p className="text-slate-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
