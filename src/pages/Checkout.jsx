import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { FaUser, FaMapMarkerAlt, FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";

import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

import { getCart } from "../services/cartService";
import { placeOrder } from "../services/orderService";
import { getDeliveryFee, getEstimatedDelivery,} from "../utils/delivery";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ===============================================
  // STATE MANAGEMENT
  // ===============================================
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Customer Information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery Address
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Terms & Conditions
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Field Errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    district: "",
    postalCode: "",
  });

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const streetAddressRef = useRef(null);
  const cityRef = useRef(null);
  const districtRef = useRef(null);
  const postalCodeRef = useRef(null);
  const termsRef = useRef(null);

  

  // ===============================================
  // LOAD DATA
  // ===============================================
  useEffect(() => {
    loadCart();
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setStreetAddress(user.address || "");
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.cart.items || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================================
  // VALIDATION FUNCTIONS
  // ===============================================
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validatePhone = (phoneValue) => {
    const phoneRegex = /^07\d{8}$/;
    return phoneRegex.test(phoneValue);
  };

  const validateCity = (cityValue) => {
    const cityRegex = /^[a-zA-Z\s]+$/;
    return cityRegex.test(cityValue);
  };

  const validatePostalCode = (postalCodeValue) => {
    const postalCodeRegex = /^\d{5}$/;
    return postalCodeRegex.test(postalCodeValue);
  };

  const clearError = (fieldName) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const setError = (fieldName, errorMessage) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  };

  // ===============================================
  // HANDLE FIELD CHANGES WITH VALIDATION
  // ===============================================
  const handleFullNameChange = (value) => {
    setFullName(value);
    if (value.trim()) {
      clearError("fullName");
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (!value.trim()) {
      setError("email", "");
    } else if (!validateEmail(value)) {
      setError("email", "Please enter a valid email address.");
    } else {
      clearError("email");
    }
  };

  const handlePhoneChange = (value) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    setPhone(digitsOnly.slice(0, 10)); // Max 10 digits

    if (!digitsOnly) {
      setError("phone", "");
    } else if (digitsOnly.length < 10) {
      setError("phone", "Phone number must be exactly 10 digits.");
    } else if (!digitsOnly.startsWith("07")) {
      setError("phone", "Phone number must start with 07.");
    } else if (digitsOnly.length === 10) {
      clearError("phone");
    }
  };

  const handleStreetAddressChange = (value) => {
    setStreetAddress(value);
    if (value.trim()) {
      clearError("streetAddress");
    }
  };

  const handleCityChange = (value) => {
    setCity(value);
    if (!value.trim()) {
      setError("city", "");
    } else if (!validateCity(value)) {
      setError("city", "City must contain letters and spaces only.");
    } else {
      clearError("city");
    }
  };

  const handleDistrictChange = (value) => {
    setDistrict(value);
    if (value.trim()) {
      clearError("district");
    }
  };

  const handlePostalCodeChange = (value) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    setPostalCode(digitsOnly.slice(0, 5)); // Max 5 digits

    if (!digitsOnly) {
      setError("postalCode", "");
    } else if (digitsOnly.length < 5) {
      setError("postalCode", "Postal code must be exactly 5 digits.");
    } else if (digitsOnly.length === 5) {
      clearError("postalCode");
    }
  };

  // ===============================================
  // HELPER FUNCTIONS
  // ===============================================
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const deliveryFee = getDeliveryFee(district);

  const estimatedDelivery = getEstimatedDelivery(district);

  const discount = 0;

  const grandTotal =
    subtotal +
    deliveryFee -
    discount;

  // ===============================================
  // HANDLE PLACE ORDER
  // ===============================================
  const focusFirstInvalidField = (fieldName) => {
    const fieldRefs = {
      fullName: fullNameRef,
      email: emailRef,
      phone: phoneRef,
      streetAddress: streetAddressRef,
      city: cityRef,
      district: districtRef,
      postalCode: postalCodeRef,
      terms: termsRef,
    };

    const targetRef = fieldRefs[fieldName];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      targetRef.current.focus();
    }
  };

  const handlePlaceOrder = async () => {
    let formValid = true;
    const newErrors = { ...errors };

    // Validate Full Name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      formValid = false;
    }

    // Validate Email
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      formValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      formValid = false;
    }

    // Validate Phone
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
      formValid = false;
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Phone must be 10 digits and start with 07.";
      formValid = false;
    }

    // Validate Street Address
    if (!streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required.";
      formValid = false;
    }

    // Validate City
    if (!city.trim()) {
      newErrors.city = "City is required.";
      formValid = false;
    } else if (!validateCity(city)) {
      newErrors.city = "City must contain letters and spaces only.";
      formValid = false;
    }

    // Validate District
    if (!district.trim()) {
      newErrors.district = "District is required.";
      formValid = false;
    }

    // Validate Postal Code
    if (!postalCode.trim()) {
      newErrors.postalCode = "Postal code is required.";
      formValid = false;
    } else if (!validatePostalCode(postalCode)) {
      newErrors.postalCode = "Postal code must be exactly 5 digits.";
      formValid = false;
    }

    setErrors(newErrors);

    const fieldOrder = [
      { field: "fullName", hasError: !!newErrors.fullName },
      { field: "email", hasError: !!newErrors.email },
      { field: "phone", hasError: !!newErrors.phone },
      { field: "streetAddress", hasError: !!newErrors.streetAddress },
      { field: "city", hasError: !!newErrors.city },
      { field: "district", hasError: !!newErrors.district },
      { field: "postalCode", hasError: !!newErrors.postalCode },
      { field: "terms", hasError: !agreeToTerms },
    ];

    const firstInvalidField = fieldOrder.find((item) => item.hasError);

    // Check Terms & Conditions
    if (!agreeToTerms) {
      if (!formValid) {
        setTimeout(() => {
          if (firstInvalidField) {
            focusFirstInvalidField(firstInvalidField.field);
          }
        }, 0);
        return;
      }

      toast.error("Please agree to the Terms & Conditions.");
      setTimeout(() => {
        focusFirstInvalidField("terms");
      }, 0);
      return;
    }

    if (!formValid) {
      setTimeout(() => {
        if (firstInvalidField) {
          focusFirstInvalidField(firstInvalidField.field);
        }
      }, 0);
      return;
    }

    const result = await Swal.fire({
      title: "Place Order?",
      text: "Please confirm that you want to place this order. Make sure your delivery details are correct before continuing.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Place Order",
      cancelButtonText: "Review Again",
      confirmButtonColor: "#2FA084",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setPlacingOrder(true);

      await placeOrder({
        customerName: fullName,
        email,
        phone,
        streetAddress,
        city,
        district,
        postalCode,
        deliveryNotes,
        paymentMethod,
      });

      const successResult = await Swal.fire({
        title: "Order Placed Successfully",
        text: "Thank you! Your order has been placed successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#2FA084",
      });

      if (successResult.isConfirmed || successResult.isDismissed) {
        navigate("/my-orders");
      }
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to place order.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#2FA084",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header showSearch={false} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-accent"></div>
            <p className="text-sm text-slate-600">Loading checkout...</p>
          </div>
        </div>
      </>
    );
  }

  const inputClass = (hasError) =>
    `w-full rounded border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors ${
      hasError
        ? "border-rose-400 focus:border-rose-400"
        : "border-slate-200 focus:border-accent"
    }`;

  return (
    <>
      <Header showSearch={false} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Secure Checkout
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Please review your information before placing your order.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {/* LEFT SIDE - 2 COLUMNS */}
            <div className="lg:col-span-2 space-y-6">
              {/* ========== SECTION 1: CUSTOMER INFORMATION ========== */}
              <div className="rounded-md border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <FaUser className="text-base text-accent" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Customer Information
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={fullNameRef}
                      type="text"
                      value={fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="Enter your full name"
                      className={inputClass(errors.fullName)}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="Enter your email"
                      className={inputClass(errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Enter your phone number"
                      className={inputClass(errors.phone)}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ========== SECTION 2: DELIVERY ADDRESS ========== */}
              <div className="rounded-md border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <FaMapMarkerAlt className="text-base text-accent" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Delivery Address
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Street Address */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={streetAddressRef}
                      type="text"
                      value={streetAddress}
                      onChange={(e) => handleStreetAddressChange(e.target.value)}
                      placeholder="e.g., 123 Main Street, Apt 4B"
                      className={inputClass(errors.streetAddress)}
                    />
                    {errors.streetAddress && (
                      <p className="mt-1 text-xs text-rose-500">{errors.streetAddress}</p>
                    )}
                  </div>

                  {/* City and District Row */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        ref={cityRef}
                        type="text"
                        value={city}
                        onChange={(e) => handleCityChange(e.target.value)}
                        placeholder="Enter your city"
                        className={inputClass(errors.city)}
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-rose-500">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        District <span className="text-rose-500">*</span>
                      </label>
                      <select
                        ref={districtRef}
                        value={district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className={inputClass(errors.district)}
                      >
                        <option value="" disabled>
                          Select your district
                        </option>
                        <option value="Ampara">Ampara</option>
                        <option value="Anuradhapura">Anuradhapura</option>
                        <option value="Badulla">Badulla</option>
                        <option value="Batticaloa">Batticaloa</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Galle">Galle</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Hambantota">Hambantota</option>
                        <option value="Jaffna">Jaffna</option>
                        <option value="Kalutara">Kalutara</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Kegalle">Kegalle</option>
                        <option value="Kilinochchi">Kilinochchi</option>
                        <option value="Kurunegala">Kurunegala</option>
                        <option value="Mannar">Mannar</option>
                        <option value="Matale">Matale</option>
                        <option value="Matara">Matara</option>
                        <option value="Monaragala">Monaragala</option>
                        <option value="Mullaitivu">Mullaitivu</option>
                        <option value="Nuwara Eliya">Nuwara Eliya</option>
                        <option value="Polonnaruwa">Polonnaruwa</option>
                        <option value="Puttalam">Puttalam</option>
                        <option value="Ratnapura">Ratnapura</option>
                        <option value="Trincomalee">Trincomalee</option>
                        <option value="Vavuniya">Vavuniya</option>
                      </select>
                      {errors.district && (
                        <p className="mt-1 text-xs text-rose-500">{errors.district}</p>
                      )}
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Postal Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      ref={postalCodeRef}
                      type="text"
                      value={postalCode}
                      onChange={(e) => handlePostalCodeChange(e.target.value)}
                      placeholder="Enter postal code"
                      className={inputClass(errors.postalCode)}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-xs text-rose-500">{errors.postalCode}</p>
                    )}
                  </div>

                  {/* Delivery Notes */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Apartment, landmark, gate number or any delivery instructions (optional)"
                      className="w-full rounded border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* ========== SECTION 3: PAYMENT METHOD ========== */}
              <div className="rounded-md border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <FaMoneyBillWave className="text-base text-accent" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Payment Method <span className="text-rose-500">*</span>
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className="relative flex cursor-pointer rounded border border-slate-200 p-4 transition-colors hover:border-accent">
                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 h-4 w-4 cursor-pointer accent-accent"
                    />
                    <div className="ml-3.5 flex flex-1 flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        Cash On Delivery
                      </span>
                      <span className="text-xs text-slate-500">
                        Pay when your order arrives
                      </span>
                      <span className="mt-1 text-xs font-medium text-accent">
                        Recommended for Sri Lanka
                      </span>
                    </div>
                    {paymentMethod === "Cash on Delivery" && (
                      <div className="flex items-center">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Credit / Debit Card */}
                  <label className="relative flex cursor-not-allowed rounded border border-slate-100 p-4 opacity-50">
                    <input
                      type="radio"
                      name="payment"
                      value="Credit Card"
                      disabled
                      className="mt-1 h-4 w-4 cursor-not-allowed accent-slate-400"
                    />
                    <div className="ml-3.5 flex flex-1 flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        Credit / Debit Card
                      </span>
                      <span className="text-xs text-slate-500">
                        Coming Soon
                      </span>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className="relative flex cursor-not-allowed rounded border border-slate-100 p-4 opacity-50">
                    <input
                      type="radio"
                      name="payment"
                      value="Bank Transfer"
                      disabled
                      className="mt-1 h-4 w-4 cursor-not-allowed accent-slate-400"
                    />
                    <div className="ml-3.5 flex flex-1 flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        Bank Transfer
                      </span>
                      <span className="text-xs text-slate-500">
                        Coming Soon
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* ========== TERMS & CONDITIONS ========== */}
              <div className="flex items-start gap-3.5 rounded-md border border-accent/20 bg-accent/5 p-5">
                <input
                  ref={termsRef}
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 cursor-pointer rounded accent-accent"
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer text-sm text-slate-700"
                >
                  I agree to the{" "}
                  <span className="font-semibold text-accent">
                    Terms & Conditions
                  </span>{" "}
                  and understand that my order will be processed as per our
                  policies.
                </label>
              </div>

              {/* ========== PLACE ORDER BUTTON (MOBILE) ========== */}
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || !agreeToTerms}
                className="w-full cursor-pointer rounded bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-300 lg:hidden"
              >
                {placingOrder ? "Processing..." : "Place Secure Order"}
              </button>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-md border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <FaShoppingCart className="text-base text-accent" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Your Order
                  </h2>
                </div>

                {/* Products */}
                <div className="mb-5 max-h-96 space-y-3 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId._id}
                      className="rounded border border-slate-100 p-3"
                    >
                      {/* Product Image */}
                      {item.productId.images && item.productId.images[0] && (
                        <img
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          className="mb-3 h-28 w-full rounded bg-white object-contain p-2"
                        />
                      )}

                      {/* Product Name */}
                      <p className="mb-2 text-sm font-medium text-slate-900">
                        {item.productId.name}
                      </p>

                      {/* Details Row */}
                      <div className="mb-2 flex justify-between text-xs text-slate-500">
                        <span>Qty: {item.quantity}</span>
                        <span>{formatPrice(item.productId.price)}</span>
                      </div>

                      {/* Subtotal for Item */}
                      <div className="flex justify-between border-t border-slate-100 pt-2 text-xs font-semibold text-slate-900">
                        <span>Subtotal</span>
                        <span>
                          {formatPrice(
                            item.productId.price * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mb-4 border-t border-slate-100" />

                {/* Pricing Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>

                  <div className="rounded border border-accent/20 bg-accent/5 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Estimated Delivery
                    </p>

                    <p className="mt-1 text-sm font-semibold text-accent">
                      {estimatedDelivery}
                    </p>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Discount</span>
                    <span>{formatPrice(discount)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-slate-100" />

                {/* Grand Total */}
                <div className="mb-6 flex justify-between">
                  <span className="text-base font-semibold text-slate-900">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {/* Place Order Button (Desktop) */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !agreeToTerms}
                  className="hidden w-full cursor-pointer rounded bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-300 lg:block"
                >
                  {placingOrder ? "Processing..." : "Place Secure Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;