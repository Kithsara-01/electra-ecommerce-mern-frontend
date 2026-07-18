import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutCompany from "../assets/about-company.png";

function About() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Genuine Products",
      description: "Every product is carefully selected from trusted manufacturers.",
    },
    {
      title: "Affordable Prices",
      description: "Competitive pricing without compromising quality or reliability.",
    },
    {
      title: "Fast Delivery",
      description: "Islandwide delivery with secure packaging and timely service.",
    },
    {
      title: "Customer Support",
      description: "Friendly assistance before and after every purchase.",
    },
  ];

  const stats = [
    { value: "500+", label: "Products Available" },
    { value: "2K+", label: "Happy Customers" },
    { value: "5+", label: "Trusted Brands" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <>
      <Header showSearch={false} />

      <main className="min-h-screen bg-slate-50">

        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              About Electra
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">
              Powering Everyday Technology
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Electra is dedicated to providing genuine electronic products,
              trusted brands, competitive prices and exceptional customer
              service across Sri Lanka.
            </p>

          </div>
        </section>

        {/* Company Story */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Left */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Our Story
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Building Trust Through Technology
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Electra was established with a simple mission: to make genuine,
                high-quality electronic products accessible to everyone. We carefully
                select trusted brands and provide reliable customer service to ensure
                every purchase delivers value.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Whether you are looking for laptops, monitors, printers or electronic
                accessories, our goal is to provide a seamless shopping experience with
                competitive prices and dependable after-sales support.
              </p>
            </div>

            {/* Right */}
            <div className="flex justify-center">
            <img
                src={aboutCompany}
                alt="Electra Showroom"
                className="h-[320px] w-full max-w-md rounded-md border border-slate-200 object-cover shadow-md"
            />
            </div>

          </div>
        </section>

        {/* Mission & Vision */}
        <section className="border-y border-slate-200 bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">

            {/* Mission */}
            <div className="rounded-md border border-slate-200 p-7 transition-colors hover:border-accent">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Our Mission
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Deliver Quality Electronics
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Our mission is to provide customers with genuine electronic products,
                competitive pricing and dependable customer service while making
                technology accessible to everyone.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-md border border-slate-200 p-7 transition-colors hover:border-accent">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Our Vision
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Become Sri Lanka's Trusted Tech Store
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                We aim to become one of Sri Lanka's most trusted online destinations
                for electronic products by combining innovation, reliability and
                customer satisfaction.
              </p>
            </div>

          </div>
        </section>

        {/* Why Choose Electra */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Why Electra
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Why Customers Choose Us
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              We are committed to providing a reliable shopping experience with
              genuine products and exceptional customer care.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-slate-200 bg-white p-7 text-center transition-colors hover:border-accent"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Company Statistics */}
        <section className="bg-secondary py-16">
          <div className="mx-auto max-w-7xl px-6">

            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Our Achievements
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                Growing With Our Customers
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                We continue to build trust through quality products and reliable service.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <h3 className="text-4xl font-bold text-accent">{stat.value}</h3>
                  <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-md border border-slate-200 bg-white px-8 py-14 text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Start Shopping
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Ready To Upgrade Your Technology?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Explore our latest collection of laptops, monitors, printers and
              accessories from trusted brands and experience hassle-free online
              shopping with Electra.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <button
                onClick={() => navigate("/products")}
                className="cursor-pointer rounded bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
              >
                Explore Products
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="cursor-pointer rounded border border-accent px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
              >
                Contact Us
              </button>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default About;