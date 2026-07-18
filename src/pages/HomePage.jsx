import Header from "../components/Header";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "../services/productService";
import {
  FaLaptop,
  FaDesktop,
  FaPrint,
  FaKeyboard,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset,
  FaStar,
} from "react-icons/fa";

import heroImage from "../assets/images/hero-image.png";


function HomePage() {

  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const fetchProducts = async () => {
      try {
        const response = await getAllProducts();

        setFeaturedProducts((response.products || []).slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };

 useEffect(() => {
    if (loading) return;

    if (user?.role === "Admin") {
      navigate("/admin-dashboard");
      return;
    }

    fetchProducts();
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  if (user?.role === "Admin") {
    return null;
  }

  const categories = [
    { icon: FaLaptop, label: "Laptops" },
    { icon: FaDesktop, label: "Monitors" },
    { icon: FaPrint, label: "Printers" },
    { icon: FaKeyboard, label: "Accessories" },
  ];

  const features = [
    {
      icon: FaTruck,
      title: "Fast Delivery",
      description: "Islandwide delivery with secure packaging.",
    },
    {
      icon: FaShieldAlt,
      title: "Warranty",
      description: "Genuine products with manufacturer warranty.",
    },
    {
      icon: FaCreditCard,
      title: "Secure Payments",
      description: "Safe and trusted payment experience.",
    },
    {
      icon: FaHeadset,
      title: "Customer Support",
      description: "Friendly support whenever you need assistance.",
    },
  ];

  const testimonials = [
    {
      name: "Kasun Perera",
      review:
        "Excellent service and genuine products. Delivery was fast and the laptop arrived in perfect condition.",
    },
    {
      name: "Nadeesha Silva",
      review:
        "Very satisfied with my purchase. Great prices, friendly staff and quick responses to my questions.",
    },
    {
      name: "Tharindu Fernando",
      review:
        "Highly recommended! Easy ordering process and quality products exactly as described.",
    },
  ];

  return (
    <>
      <Header showSearch={false} />

      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-20 lg:flex-row">
            {/* Left Content */}
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Electra Store
              </p>

              <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
                Premium Electronics
                <br />
                For Everyday Life
              </h1>

              <p className="mt-5 text-base leading-7 text-slate-600">
                Discover laptops, monitors, printers, networking devices and
                accessories from trusted brands at competitive prices.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/products")}
                  className="cursor-pointer rounded bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
                >
                  Shop Now
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="cursor-pointer rounded border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-accent hover:text-accent"
                >
                  Browse Products
                </button>
              </div>
            </div>

            {/* Right Content */}
            {/* Right Content */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={heroImage}
                alt="Electra Premium Electronics"
                className="w-full max-w-[700px] object-contain"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Shop by Category
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Find the right electronic products for work, study and everyday life.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ icon: Icon, label }) => (
              <div
                key={label}
                onClick={() => navigate("/products")}
                className="cursor-pointer rounded-md border border-slate-200 bg-white p-7 text-center transition-colors hover:border-accent"
              >
                <Icon className="mx-auto text-3xl text-accent" />

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {label}
                </h3>

                <p className="mt-1.5 text-xs text-slate-500">
                  Browse premium {label.toLowerCase()}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Featured Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Popular Products
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Discover some of our most popular electronic products.
              </p>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="hidden cursor-pointer rounded border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white md:block"
            >
              View All
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => navigate("/products")}
              className="cursor-pointer rounded border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              View All Products
            </button>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Why Choose Us
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Why Shop With Electra?
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              We provide quality electronic products backed by reliable service and
              customer satisfaction.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-md border border-slate-200 bg-white p-7 text-center transition-colors hover:border-accent"
              >
                <Icon className="mx-auto text-3xl text-accent" />

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Testimonials
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              What Our Customers Say
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Trusted by customers across Sri Lanka for quality products and reliable
              service.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.map((review) => (
              <div
                key={review.name}
                className="rounded-md border border-slate-200 bg-white p-7 transition-colors hover:border-accent"
              >
                <div className="mb-3 flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar key={index} className="text-sm" />
                  ))}
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  "{review.review}"
                </p>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {review.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Verified Customer
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-md bg-accent px-8 py-14 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em]">
              Ready To Shop?
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Upgrade Your Tech Today
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90">
              Explore our collection of laptops, monitors, printers and accessories
              from trusted brands at competitive prices.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/products")}
                className="cursor-pointer rounded bg-white px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-slate-100"
              >
                Shop Now
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="cursor-pointer rounded border border-white px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-accent"
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

export default HomePage;