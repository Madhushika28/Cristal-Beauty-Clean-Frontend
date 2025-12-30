import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {FaPhoneAlt,FaEnvelope,FaMapMarkerAlt,FaClock,FaPaperPlane,FaUser,FaMobileAlt, FaComment} from "react-icons/fa";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

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
      setSuccess("Thank you for your message! We'll get back to you within 24 hours.");
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)]/95 to-white/10 px-6 py-16 md:py-24">
      
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="mb-6">
          <span className="inline-block bg-gradient-to-r from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold px-6 py-2 rounded-full text-sm uppercase tracking-wider border border-[var(--color-accent)]/30">
            Get In Touch
          </span>
        </div>
        <h1 className="text-[var(--color-secondary)] text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Contact <span className="text-[var(--color-accent)]">Cristal Beauty</span>
        </h1>
        <p className="text-[var(--color-secondary)]/80 text-xl max-w-2xl mx-auto leading-relaxed">
          Have questions or need assistance? We're here to help! Reach out to us through any of our channels.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SECTION - CONTACT INFO */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-accent)]/30 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
          <div className="relative bg-gradient-to-br from-white to-white/95 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl p-10">
            
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/80 p-3 rounded-xl">
                  <FaPaperPlane className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[var(--color-secondary)]">
                  Get In Touch With Us!
                </h2>
              </div>
              <p className="text-[var(--color-secondary)]/70 text-lg">
                Choose your preferred way to connect with our team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="tel:+94771234567" className="group/card bg-gradient-to-br from-white to-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 p-4 rounded-full group-hover/card:scale-110 transition-transform duration-300">
                    <FaPhoneAlt className="text-3xl text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-bold text-xl text-[var(--color-secondary)] mb-2">Phone Number</h3>
                  <p className="text-[var(--color-secondary)]/70 mb-3">Call us anytime</p>
                  <span className="text-lg font-semibold text-[var(--color-accent)]">+94 77 123 4567</span>
                </div>
              </a>
              
              <a href="mailto:support@cristalbeauty.com?subject=Contact%20Cristal%20Beauty" className="group/card bg-gradient-to-br from-white to-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 p-4 rounded-full group-hover/card:scale-110 transition-transform duration-300">
                    <FaEnvelope className="text-3xl text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-bold text-xl text-[var(--color-secondary)] mb-2">Email</h3>
                  <p className="text-[var(--color-secondary)]/70 mb-3">Send us an email</p>
                  <span className="text-lg font-semibold text-[var(--color-accent)] break-all">support@cristalbeauty.com</span>
                </div>
              </a>
              
              <a href="https://www.google.com/maps?q=Colombo,+Sri+Lanka" target="_blank" rel="noopener noreferrer" className="group/card bg-gradient-to-br from-white to-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 p-4 rounded-full group-hover/card:scale-110 transition-transform duration-300">
                    <FaMapMarkerAlt className="text-3xl text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-bold text-xl text-[var(--color-secondary)] mb-2">Location</h3>
                  <p className="text-[var(--color-secondary)]/70 mb-3">Find us on map</p>
                  <span className="text-lg font-semibold text-[var(--color-accent)]">Colombo, Sri Lanka</span>
                </div>
              </a>
              
              <div className="group/card bg-gradient-to-br from-white to-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 p-4 rounded-full group-hover/card:scale-110 transition-transform duration-300">
                    <FaClock className="text-3xl text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-bold text-xl text-[var(--color-secondary)] mb-2">Working Hours</h3>
                  <p className="text-[var(--color-secondary)]/70 mb-3">We're available</p>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-[var(--color-accent)]">Mon – Sat</p>
                    <p className="text-[var(--color-secondary)]/80">09:00 AM – 06:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - CONTACT FORM */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-secondary)]/30 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
          <div className="relative bg-gradient-to-br from-white to-white/95 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl p-10">
            
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary)]/80 p-3 rounded-xl">
                  <FaComment className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[var(--color-secondary)]">
                  Send Us a Message
                </h2>
              </div>
              <p className="text-[var(--color-secondary)]/70 text-lg">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)]/30 to-transparent rounded-xl blur opacity-0 group-hover/input:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUser className="text-[var(--color-accent)]" />
                      <label className="text-sm font-medium text-[var(--color-secondary)]">First Name *</label>
                    </div>
                    <input 
                      type="text" 
                      name="firstName" 
                      placeholder="Enter your first name" 
                      className="w-full p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)]/30 to-transparent rounded-xl blur opacity-0 group-hover/input:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUser className="text-[var(--color-accent)]" />
                      <label className="text-sm font-medium text-[var(--color-secondary)]">Last Name</label>
                    </div>
                    <input 
                      type="text" 
                      name="lastName" 
                      placeholder="Enter your last name" 
                      className="w-full p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)]/30 to-transparent rounded-xl blur opacity-0 group-hover/input:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <FaMobileAlt className="text-[var(--color-accent)]" />
                      <label className="text-sm font-medium text-[var(--color-secondary)]">Mobile No *</label>
                    </div>
                    <input 
                      type="text" 
                      name="mobile" 
                      placeholder="Enter your mobile number" 
                      className="w-full p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)]/30 to-transparent rounded-xl blur opacity-0 group-hover/input:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <FaEnvelope className="text-[var(--color-accent)]" />
                      <label className="text-sm font-medium text-[var(--color-secondary)]">Email ID *</label>
                    </div>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Enter your email address" 
                      className="w-full p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="relative group/input">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)]/30 to-transparent rounded-xl blur opacity-0 group-hover/input:opacity-50 transition duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <FaComment className="text-[var(--color-accent)]" />
                    <label className="text-sm font-medium text-[var(--color-secondary)]">Message *</label>
                  </div>
                  <textarea 
                    name="message" 
                    rows="6" 
                    placeholder="Write your message here..." 
                    className="w-full p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 resize-none rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300" 
                    required 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="relative group/btn overflow-hidden w-full md:w-auto px-12 py-5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/90 text-white text-lg font-bold rounded-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaPaperPlane className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {success && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl">
                    <p className="text-green-600 font-semibold text-center">{success}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* ADDITIONAL INFO */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <div className="bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent backdrop-blur-sm border border-white/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
            ✨ Premium Customer Support
          </h3>
          <p className="text-[var(--color-secondary)]/70 text-lg">
            Our team typically responds within 2-4 hours during working hours. For urgent matters, please call us directly.
          </p>
        </div>
      </div>

    </div>
  );
}