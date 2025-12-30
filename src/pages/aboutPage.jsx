export default function AboutPage() {
  return (
    <div className="w-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary)]/95 px-6 py-16 md:py-24">

      {/* HERO SECTION */}
      <div className="max-w-[1200px] mx-auto text-center mb-20">
        <div className="mb-8">
          <span className="text-[var(--color-accent)] font-semibold tracking-wider text-sm uppercase">
            Natural Beauty • Premium Quality
          </span>
        </div>
        <h1 className="text-[var(--color-secondary)] text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          About <span className="text-[var(--color-accent)]">Cristal</span> Beauty
        </h1>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)]/20 to-transparent blur-xl"></div>
          <p className="text-[var(--color-secondary)]/90 text-lg md:text-xl relative leading-relaxed">
            Cristal Beauty brings you premium skincare, haircare, and cosmetic
            products designed to enhance your natural beauty. Every product is
            crafted with care using <span className="font-semibold text-[var(--color-accent)]">high-quality ingredients</span> and
            <span className="font-semibold text-[var(--color-accent)]"> sustainable practices</span>.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        
        {/* IMAGE */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-accent)]/30 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/about-image.jpg"
              alt="Cristal Beauty Products"
              className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-secondary)]">50K+</div>
              <div className="text-sm text-[var(--color-secondary)]/70">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* VISION & MISSION CARDS */}
        <div className="space-y-8">
          {/* Vision Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-white to-white/90 backdrop-blur-md rounded-2xl p-10 border border-white/40 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] p-3 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[var(--color-secondary)] text-2xl font-bold mb-3">Our Vision</h2>
                  <p className="text-[var(--color-secondary)]/80 text-lg leading-relaxed">
                    To become the most trusted beauty brand that inspires <span className="font-semibold text-[var(--color-accent)]">confidence</span> and <span className="font-semibold text-[var(--color-accent)]">self-love</span>, enhancing natural beauty for everyone across the globe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-white to-white/90 backdrop-blur-md rounded-2xl p-10 border border-white/40 shadow-xl transform transition-all duration-500 group-hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] p-3 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[var(--color-secondary)] text-2xl font-bold mb-3">Our Mission</h2>
                  <p className="text-[var(--color-secondary)]/80 text-lg leading-relaxed mb-4">
                    To provide <span className="font-semibold text-[var(--color-accent)]">premium quality</span> skincare, haircare, and cosmetic products made with carefully selected natural ingredients.
                  </p>
                  <p className="text-[var(--color-secondary)]/80 text-lg leading-relaxed">
                    We combine <span className="font-semibold text-[var(--color-accent)]">innovation</span> and <span className="font-semibold text-[var(--color-accent)]">sustainability</span> to deliver real results, helping customers feel confident and radiant every day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS FOCUS SECTION - Clean version without buttons */}
      <div className="max-w-[1200px] mx-auto mb-32">
        <div className="text-center mb-16">
          <h2 className="text-[var(--color-secondary)] text-4xl font-bold mb-4">
            Our Product <span className="text-[var(--color-accent)]">Categories</span>
          </h2>
          <p className="text-[var(--color-secondary)]/70 text-lg max-w-2xl mx-auto">
            We specialize in three main categories of premium beauty products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Skincare", 
              desc: "Hydrating creams, face washes, and serums designed for glowing, healthy skin.",
              icon: "💆‍♀️"
            },
            { 
              title: "Haircare", 
              desc: "Natural oils, shampoos, and treatments for strong, shiny, and beautiful hair.",
              icon: "💇‍♀️"
            },
            { 
              title: "Cosmetics", 
              desc: "Lipsticks, kajals, and makeup products that enhance your natural features.",
              icon: "💄"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--color-accent)]/50 to-transparent rounded-3xl blur group-hover:blur-xl transition duration-500"></div>
              <div className="relative bg-gradient-to-b from-white to-white/95 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/40 transform transition-all duration-500 group-hover:-translate-y-3 hover:shadow-2xl h-full flex flex-col items-center text-center">
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">{item.title}</h3>
                <p className="text-[var(--color-secondary)]/70 text-lg leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA SECTION - Keep only main shop button */}
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-accent)]/10 p-16 backdrop-blur-sm border border-white/20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--color-secondary)]/10 rounded-full translate-x-32 translate-y-32"></div>
          
          <div className="relative">
            <h2 className="text-[var(--color-secondary)] text-4xl md:text-5xl font-bold mb-6">
              Experience the <span className="text-[var(--color-accent)]">Cristal Beauty</span> Difference
            </h2>
            <p className="text-[var(--color-secondary)]/80 text-xl mb-8 max-w-2xl mx-auto">
              Join our community of thousands who trust Cristal Beauty for their daily self-care rituals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Shop All Products
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md text-[var(--color-secondary)] px-12 py-4 rounded-xl font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}