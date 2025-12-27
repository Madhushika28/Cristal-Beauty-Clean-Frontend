export default function AboutPage() {
  return (
    <div className="w-full bg-[var(--color-primary)] px-6 py-16 md:py-24">

      {/* HERO SECTION */}
      <div className="max-w-[1200px] mx-auto text-center mb-24">
        <h1 className="text-[var(--color-secondary)] text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">
          About Cristal Beauty
        </h1>
        <p className="text-[var(--color-secondary)]/80 text-lg md:text-xl max-w-3xl mx-auto animate-fadeIn delay-200">
          Cristal Beauty brings you premium skincare, haircare, and cosmetic
          products designed to enhance your natural beauty. Every product is
          crafted with care using high-quality ingredients.
        </p>
      </div>

      {/* IMAGE + CARDS SIDE BY SIDE */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-32">

        {/* IMAGE */}
        <div className="w-full flex justify-center animate-fadeIn">
          <img
            src="/about-image.jpg"
            alt="Cristal Beauty"
            className="w-full h-auto rounded-3xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* CARDS */}
        <div className="flex flex-col gap-8 h-full">
          {/* Vision Card */}
          <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 transform transition duration-500 hover:-translate-y-3 hover:shadow-2xl animate-fadeIn">
            <h2 className="text-[var(--color-secondary)] text-2xl font-semibold mb-4">
              Our Vision
            </h2>
            <p className="text-[var(--color-secondary)]/90 text-lg leading-relaxed">
              To become a trusted beauty brand that inspires confidence and self-love, enhancing natural beauty for everyone.
            </p>
          </div>

          {/* Mission Card */}
          <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 transform transition duration-500 hover:-translate-y-3 hover:shadow-2xl animate-fadeIn delay-100">
            <h2 className="text-[var(--color-secondary)] text-2xl font-semibold mb-4">
              Our Mission
            </h2>
            <p className="text-[var(--color-secondary)]/90 text-lg leading-relaxed mb-3">
              To provide high-quality skincare, haircare, and cosmetic products made with carefully selected ingredients.
            </p>
            <p className="text-[var(--color-secondary)]/90 text-lg leading-relaxed">
              We combine innovation and natural ingredients to deliver real results, helping customers feel confident and radiant.
            </p>
          </div>
        </div>
      </div>

      {/* PRODUCTS FOCUS SECTION */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-28">
        {[
          { title: "Skincare", desc: "Hydrating creams, face washes, and serums designed for glowing skin." },
          { title: "Haircare", desc: "Natural oils, shampoos, and treatments for strong, shiny hair." },
          { title: "Cosmetics", desc: "Lipsticks, kajals, and other products that enhance your natural beauty." }
        ].map((item, idx) => (
          <div key={idx} className="bg-[var(--color-accent)] text-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 animate-fadeIn delay-[${idx * 100}ms]">
            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
            <p className="text-lg">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA SECTION */}
      <div className="max-w-[1200px] mx-auto text-center animate-fadeIn">
        <h2 className="text-[var(--color-secondary)] text-3xl md:text-4xl font-semibold mb-4">
          Discover the Cristal Beauty Difference
        </h2>
        <p className="text-[var(--color-secondary)]/80 text-lg md:text-xl mb-6">
          Join thousands of satisfied customers who trust Cristal Beauty for their daily self-care routine.
        </p>
        <a
          href="/products"
          className="inline-block bg-[var(--color-accent)] text-white px-10 py-4 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition transform duration-300 shadow-md hover:shadow-lg"
        >
          Explore Products
        </a>
      </div>

    </div>
  );
}
