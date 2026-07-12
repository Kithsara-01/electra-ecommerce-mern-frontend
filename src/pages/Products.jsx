import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Product = () => {
  const product = {
    name: "Apple iPhone 16 Pro",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    price: 429999,
    category: "Smartphone",
    brand: "Apple",
    stock: 15,
    rating: 4.8,
    description:
      "Experience powerful performance with the latest Apple iPhone featuring an advanced camera system and stunning display.",
    specifications: {
      Display: "6.3-inch OLED",
      Processor: "A18 Pro Chip",
      RAM: "8 GB",
      Storage: "256 GB",
      Camera: "48 MP Triple Camera",
      Battery: "3582 mAh",
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-10">

        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="rounded-xl shadow-lg w-full"
          />
        </div>

        {/* Product Details */}
        <div>

          <span className="bg-red-600 text-white px-3 py-1 rounded">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mt-4">
            {product.name}
          </h1>

          <p className="text-gray-500 mt-2">
            Brand: {product.brand}
          </p>

          <p className="text-yellow-500 text-xl mt-2">
            ⭐ {product.rating}
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-5">
            Rs. {product.price.toLocaleString()}
          </h2>

          <p className="mt-4 text-gray-700">
            {product.description}
          </p>

          <div className="mt-6">
            <p
              className={`font-semibold ${
                product.stock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </p>
          </div>

          <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">
          Specifications
        </h2>

        <table className="w-full border">
          <tbody>
            {Object.entries(product.specifications).map(([key, value]) => (
              <tr key={key} className="border-b">
                <td className="font-semibold p-3 bg-gray-100 w-1/3">
                  {key}
                </td>
                <td className="p-3">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;