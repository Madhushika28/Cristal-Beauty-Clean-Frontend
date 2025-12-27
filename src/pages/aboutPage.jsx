export default function AboutPage() {
  return (
    <div className="w-full bg-[var(--color-primary)] px-6 py-12">

      {/* HERO SECTION */}
      <div className="max-w-[1200px] mx-auto text-center mb-16">
        <h1 className="text-[var(--color-secondary)] text-4xl md:text-5xl font-bold mb-4">
          About Cristal Beauty
        </h1>
        <p className="text-[var(--color-secondary)]/80 text-lg md:text-xl max-w-3xl mx-auto">
          Cristal Beauty brings you premium skincare, haircare, and cosmetic products designed to enhance your natural beauty. Every product is crafted with care using high-quality ingredients.
        </p>
      </div>

      {/* IMAGE + MISSION SECTION */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img
            src="/about-image.jpg"  // image in public folder
            alt="Cristal Beauty Products"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-[var(--color-secondary)] text-3xl font-semibold mb-4">
            Our Mission
          </h2>
          <p className="text-[var(--color-secondary)]/90 text-lg mb-4">
            To provide high-quality beauty products that make every customer feel confident and radiant. From skincare to haircare, every item is formulated to nourish and protect.
          </p>
          <p className="text-[var(--color-secondary)]/90 text-lg">
            We combine innovation and natural ingredients to create products that deliver real results, helping you glow inside and out.
          </p>
        </div>
      </div>

      {/* PRODUCTS FOCUS SECTION */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
        <div className="bg-[var(--color-accent)] text-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Skincare</h3>
          <p>Hydrating creams, face washes, and serums designed for glowing skin.</p>
        </div>
        <div className="bg-[var(--color-accent)] text-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Haircare</h3>
          <p>Natural oils, shampoos, and treatments for strong, shiny hair.</p>
        </div>
        <div className="bg-[var(--color-accent)] text-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Cosmetics</h3>
          <p>Lipsticks, kajals, and other products that enhance your natural beauty.</p>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-[var(--color-secondary)] text-3xl font-semibold mb-4">
          Discover the Cristal Beauty Difference
        </h2>
        <p className="text-[var(--color-secondary)]/80 text-lg mb-6">
          Join thousands of satisfied customers who trust Cristal Beauty for their daily self-care routine.
        </p>
        <a
          href="/products"
          className="inline-block bg-[var(--color-accent)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--color-accent)]/90 transition"
        >
          Explore Products
        </a>
      </div>

    </div>
  );
}
