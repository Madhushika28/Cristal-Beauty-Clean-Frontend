import { Link } from "react-router-dom";

export default function HomeContent() {
  return (
    <main className="w-full bg-gradient-to-b from-[var(--color-primary)] to-white/5">
      <section className="w-full relative overflow-hidden py-12 lg:py-20 min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/20 backdrop-blur-[1px]"></div>
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-accent)]/20 to-black/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
              <div className="relative bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 lg:p-10 shadow-2xl">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-accent)]/10 backdrop-blur-sm px-6 py-3 rounded-full border border-[var(--color-accent)]/30 mb-8">
                  <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse"></span>
                  <span className="text-white font-semibold text-sm uppercase tracking-wider">
                    Premium Beauty Products
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                  <span className="text-white block">Beauty That</span>
                  <span className="text-white block">Shines,</span>
                  <span className="relative">
                    <span className="bg-gradient-to-r from-[var(--color-accent)] to-pink-400 bg-clip-text text-transparent">
                      Confidence
                    </span>
                    <span className="text-white"> That Lasts</span>
                  </span>
                </h1>

                {/* DESCRIPTION */}
                <p className="text-white/80 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl">
                  Discover our range of premium skincare, nourishing haircare,
                  and high-quality cosmetic products, each carefully crafted
                  with safe and effective ingredients to enhance your natural
                  beauty and provide a luxurious self-care experience.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="group relative overflow-hidden bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative flex items-center justify-center gap-3">
                      Shop Now
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        ></path>
                      </svg>
                    </span>
                  </Link>

                  <Link
                    to="/contact"
                    className="group relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 hover:shadow-lg transform transition-all duration-300"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      Contact Us
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-accent)]/30 via-white/20 to-transparent rounded-3xl blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-700"></div>

              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700 border-4 border-white/20">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                >
                  <source src="/hero.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/90 text-white rounded-2xl p-6 shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-center">
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-sm opacity-90">Natural</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"></div>
            <span className="text-[var(--color-accent)] font-semibold uppercase tracking-wider text-sm">
              Why Choose Us
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-6">
            The Cristal Beauty{" "}
            <span className="text-[var(--color-accent)]">Promise</span>
          </h2>
          <p className="text-[var(--color-secondary)]/70 text-lg max-w-2xl mx-auto">
            We're committed to delivering excellence in every product we create
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Premium Quality",
              desc: "Highest grade ingredients for superior results",
              icon: "✨",
            },
            {
              title: "Dermatologically Tested",
              desc: "Safe for all skin types, scientifically proven",
              icon: "🔬",
            },
            {
              title: "Safe Ingredients",
              desc: "Free from harmful chemicals and additives",
              icon: "🌿",
            },
            {
              title: "Fast Delivery",
              desc: "Island-wide shipping with tracking",
              icon: "🚚",
            },
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--color-accent)]/30 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-b from-white to-white/95 backdrop-blur-md border border-white/40 rounded-2xl p-8 shadow-xl hover:shadow-2xl transform transition-all duration-500 group-hover:-translate-y-3 h-full">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-3">
                  {item.title}
                </h3>
                <p className="text-[var(--color-secondary)]/70">{item.desc}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="w-full h-1 bg-gradient-to-r from-[var(--color-accent)]/30 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/70 via-[var(--color-accent)]/50 to-pink-600/70"></div>
        </div>

        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* HEADING */}
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight">
            Upgrade Your
            <br />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Beauty Routine Today
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="text-white/90 text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Trusted cosmetic products loved across Sri Lanka, designed to
            enhance your beauty and confidence every single day. Join thousands
            of satisfied customers who have transformed their beauty routine.
          </p>

          {/* CTA BUTTON */}
          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-3 bg-white text-[var(--color-accent)] px-12 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300"
          >
            <span>Start Shopping Now</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </Link>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <div>Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div>Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div>Customer Support</div>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}
