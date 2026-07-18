import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { sendContactMessage } from "../services/contactService";
import Header from "../components/Header";
import contactBg from "../assets/contact-bg.jpg";
import Footer from "../components/Footer";

function Contact() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  subject: "",
  message: "",
});

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await sendContactMessage(formData);

    toast.success(response.message);

    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to send message."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Header showSearch={false} />

      <main className="min-h-screen bg-slate-50">

        {/* Hero */}
        <section
            className="relative border-b border-slate-200"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.80), rgba(255,255,255,0.80)), url(${contactBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Contact Us
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">
              We're Here To Help
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Have a question about our products or services? Our team is
              always ready to assist you.
            </p>

          </div>
        </section>

        {/* Contact Information */}
        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Get In Touch
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Contact Information
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Reach out to us through any of the following contact methods.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-md border border-slate-200 bg-white p-7 text-center transition-colors hover:border-accent">
              <h3 className="text-lg font-semibold text-slate-900">
                Address
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                No. 123,<br />
                Colombo,<br />
                Sri Lanka
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-7 text-center transition-colors hover:border-accent">
              <h3 className="text-lg font-semibold text-slate-900">
                Phone
              </h3>

              <p className="mt-3 text-sm text-slate-600">
                +94 77 123 4567
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-7 text-center transition-colors hover:border-accent">
              <h3 className="text-lg font-semibold text-slate-900">
                Email
              </h3>

              <p className="mt-3 text-sm text-slate-600">
                support@electra.com
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-7 text-center transition-colors hover:border-accent">
              <h3 className="text-lg font-semibold text-slate-900">
                Working Hours
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Monday - Saturday<br />
                9.00 AM - 6.00 PM
              </p>
            </div>

          </div>

        </section>

        {/* Contact Form */}
        <section className="border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-4xl px-6">

            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Send A Message
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                We'd Love To Hear From You
              </h2>

              <p className="mt-3 text-sm text-slate-600">
                Fill out the form below and our team will get back to you as soon as
                possible.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-4"
            >

              <div className="grid gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                    required
                  />
                </div>

              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="w-full rounded border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full rounded border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer rounded bg-accent px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </form>

          </div>
        </section>

        {/* Store Location */}
        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Find Us
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Visit Our Store
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              We welcome you to visit our store and explore our latest electronic
              products in person.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-md border border-slate-200 bg-white">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.881064234607!2d81.26273367447925!3d6.28440212589672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae69c30fff5ee25%3A0x3d5be262c57b303e!2sH%2FDebarawewa%20Central%20College%20(National%20School)!5e1!3m2!1sen!2slk!4v1784348860007!5m2!1sen!2slk"
              width="100%"
              height="380"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-md bg-accent px-8 py-14 text-center text-white">

            <p className="text-xs font-semibold uppercase tracking-[0.25em]">
              Ready To Explore?
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Discover Premium Electronics Today
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/90">
              Browse our latest collection of laptops, monitors, printers and
              accessories. Find the perfect technology solution for your work,
              study and everyday life.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <button
                onClick={() => navigate("/products")}
                className="cursor-pointer rounded bg-white px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-slate-100"
              >
                Shop Now
              </button>

              <button
                onClick={() => navigate("/about")}
                className="cursor-pointer rounded border border-white px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-accent"
              >
                Learn More
              </button>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Contact;