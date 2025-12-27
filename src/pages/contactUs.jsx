import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";

export default function ContactUsPage() {
  return (
    <div className="w-full bg-[var(--color-primary)] px-6 py-12">

      {/* FULL WIDTH CONTAINER */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT SECTION */}
        <div className="bg-[var(--color-primary)] border border-[var(--color-secondary)]/10 rounded-lg shadow-md">
          <div className="bg-[var(--color-accent)] text-white text-center py-5 text-2xl font-semibold rounded-t-lg">
            Get In Touch With Us Now!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-6 px-10 py-14 text-[var(--color-secondary)]">

            {/* PHONE */}
            <a
              href="tel:+94771234567"
              className="text-center hover:text-[var(--color-accent)] transition"
            >
              <FaPhoneAlt className="mx-auto text-3xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl">Phone Number</h3>
              <p className="mt-1">+94 77 123 4567</p>
            </a>

            {/* EMAIL */}
            <a
              href="mailto:support@cristalbeauty.com?subject=Contact%20Cristal%20Beauty%20Clean"
              className="text-center hover:text-[var(--color-accent)] transition"
            >
              <FaEnvelope className="mx-auto text-3xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl">Email</h3>
              <p className="mt-1">support@cristalbeauty.com</p>
              <p>sales@cristalbeauty.com</p>
            </a>

            {/* LOCATION */}
            <a
              href="https://www.google.com/maps?q=Colombo,+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center hover:text-[var(--color-accent)] transition"
            >
              <FaMapMarkerAlt className="mx-auto text-3xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl">Location</h3>
              <p className="mt-1">Colombo, Sri Lanka</p>
            </a>

            {/* WORKING HOURS */}
            <div className="text-center">
              <FaClock className="mx-auto text-3xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl">Working Hours</h3>
              <p className="mt-1">Mon – Sat</p>
              <p>09:00 AM – 06:00 PM</p>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION – FORM */}
        <div className="bg-[var(--color-primary)] border border-[var(--color-secondary)]/10 rounded-lg shadow-md">
          <div className="bg-[#0D1164] text-white text-center py-5 text-2xl font-semibold rounded-t-lg">
  Contact Us
</div>


          <form className="px-10 py-12 flex flex-col gap-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="First Name *"
                className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-md bg-[var(--color-primary)]"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-md bg-[var(--color-primary)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Mobile No *"
                className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-md bg-[var(--color-primary)]"
              />
              <input
                type="email"
                placeholder="Email ID *"
                className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-md bg-[var(--color-primary)]"
              />
            </div>

            <textarea
              rows="6"
              placeholder="Message"
              className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none rounded-md bg-[var(--color-primary)]"
            />

            <button
              type="submit"
              className="w-[200px] mt-4 bg-[var(--color-accent)] text-white py-4 text-lg font-semibold hover:bg-[var(--color-accent)]/90 transition rounded-md"
            >
              Submit →
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
