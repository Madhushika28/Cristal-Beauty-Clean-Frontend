import { Link } from "react-router-dom";

export default function HomeContent() {
  return (
    <main className="w-full bg-[var(--color-primary)]">

      {/* ================= HERO SECTION ================= */}
      <section className="w-full relative overflow-hidden">
        {/* FULL BACKGROUND VIDEO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover filter blur-sm scale-105"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay for readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-start gap-10 mt-6 lg:mt-10">

          {/* SMALL VIDEO BOX */}
          <div className="w-full lg:w-[55%] h-[350px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>

          {/* RIGHT CONTENT CARD */}
          <div className="w-full lg:w-[40%] bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-secondary leading-tight">
              Beauty That Shines,
              <br />
              <span className="text-accent">Confidence That Lasts</span>
            </h1>

            <p className="mt-5 text-secondary/70 text-base">
               Discover our range of premium skincare, nourishing haircare, and high-quality cosmetic products, each carefully crafted with safe and effective ingredients to enhance your natural beauty, boost your confidence, and provide a luxurious self-care experience every day.
            </p>

            <div className="mt-6 flex gap-4 flex-wrap">
              <Link
                to="/products"
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-secondary transition shadow"
              >
                Shop Now
              </Link>

              <Link
                to="/contact"
                className="px-6 py-3 border border-secondary/30 rounded-lg text-secondary hover:bg-secondary hover:text-white transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================= BENEFITS ================= */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
    {[
      "Premium Quality",
      "Dermatologically Tested",
      "Safe Ingredients",
      "Fast Delivery",
    ].map((item, i) => (
      <div
        key={i}
        className="bg-[var(--color-secondary)] text-white p-6 rounded-xl shadow transition-transform transform hover:-translate-y-2 hover:shadow-xl cursor-pointer"
      >
        <p className="font-semibold">{item}</p>
      </div>
    ))}
  </div>
</section>


      {/* ================= CTA ================= */}
<section className="bg-gradient-to-r from-[var(--color-accent)] to-pink-600 py-20 text-center text-white relative overflow-hidden">
  {/* Optional decorative element */}
  <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>

  <h2 className="text-4xl lg:text-5xl font-extrabold leading-snug">
    Upgrade Your Beauty Routine Today
  </h2>

  <p className="mt-6 text-white/80 text-lg lg:text-xl max-w-2xl mx-auto">
    Trusted cosmetic products loved across Sri Lanka, designed to enhance your beauty and confidence every single day.
  </p>

  <Link
    to="/products"
    className="inline-block mt-8 px-10 py-4 bg-white text-[var(--color-accent)] font-semibold rounded-full shadow-lg hover:bg-[var(--color-secondary)] hover:text-white transform hover:-translate-y-1 transition-all duration-300"
  >
    Start Shopping
  </Link>
</section>


    </main>
  );
}
