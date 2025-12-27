import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      mobile: e.target.mobile.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/contact", data);
      toast.success("Your message has been sent successfully!");
      setSuccess("Thank you! We will get back to you soon.");
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[var(--color-primary)] px-6 py-16 md:py-24">
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SECTION */}
        <div className="bg-white/95 backdrop-blur-md border border-[var(--color-secondary)]/20 rounded-3xl shadow-lg p-8 animate-fadeIn">
          <div className="bg-[var(--color-accent)]/70 text-white text-center py-6 text-2xl md:text-3xl font-bold rounded-2xl mb-8 shadow-md">
            Get In Touch With Us!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[var(--color-secondary)]">
            <a href="tel:+94771234567" className="text-center p-4 rounded-xl hover:bg-[var(--color-accent)]/10 transition">
              <FaPhoneAlt className="mx-auto text-4xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl mb-1">Phone Number</h3>
              <p>+94 77 123 4567</p>
            </a>
            <a href="mailto:support@cristalbeauty.com?subject=Contact%20Cristal%20Beauty" className="text-center p-4 rounded-xl hover:bg-[var(--color-accent)]/10 transition">
              <FaEnvelope className="mx-auto text-4xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl mb-1">Email</h3>
              <p>support@cristalbeauty.com</p>
            </a>
            <a href="https://www.google.com/maps?q=Colombo,+Sri+Lanka" target="_blank" rel="noopener noreferrer" className="text-center p-4 rounded-xl hover:bg-[var(--color-accent)]/10 transition">
              <FaMapMarkerAlt className="mx-auto text-4xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl mb-1">Location</h3>
              <p>Colombo, Sri Lanka</p>
            </a>
            <div className="text-center p-4 rounded-xl hover:bg-[var(--color-accent)]/10 transition">
              <FaClock className="mx-auto text-4xl text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-xl mb-1">Working Hours</h3>
              <p>Mon – Sat</p>
              <p>09:00 AM – 06:00 PM</p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION – FORM */}
        <div className="bg-white/95 backdrop-blur-md border border-[var(--color-secondary)]/20 rounded-3xl shadow-lg p-8 animate-fadeIn delay-100">
          <div className="bg-[var(--color-accent)]/70 text-white text-center py-6 text-2xl md:text-3xl font-bold rounded-2xl mb-8 shadow-md">
            Contact Us
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name *" className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-xl bg-[var(--color-primary)]/10" required />
              <input type="text" name="lastName" placeholder="Last Name" className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-xl bg-[var(--color-primary)]/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="mobile" placeholder="Mobile No *" className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-xl bg-[var(--color-primary)]/10" required />
              <input type="email" name="email" placeholder="Email ID *" className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-xl bg-[var(--color-primary)]/10" required />
            </div>
            <textarea name="message" rows="6" placeholder="Message" className="p-4 border border-[var(--color-secondary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none rounded-xl bg-[var(--color-primary)]/10" required />

            <button type="submit" disabled={loading} className="w-full md:w-[220px] mt-4 bg-[var(--color-accent)] text-white py-4 text-lg font-semibold hover:bg-[var(--color-accent)]/90 transition rounded-xl shadow-md hover:shadow-lg self-center">
              {loading ? "Sending..." : "Submit →"}
            </button>

            {success && <p className="mt-4 text-green-600 font-semibold">{success}</p>}
          </form>
        </div>

      </div>
    </div>
  );
}
