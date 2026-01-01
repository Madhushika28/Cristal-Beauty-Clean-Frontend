import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaUniversity,
  FaMobileAlt,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

const validateSriLankanMobile = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  if (!/^0\d{9}$/.test(cleaned)) {
    return false;
  }
  const validPrefixes = [
    "070",
    "071",
    "072",
    "074",
    "075",
    "076",
    "077",
    "078",
  ];
  const prefix = cleaned.substring(0, 3);
  return validPrefixes.includes(prefix);
};

const formatPhoneInput = (value) => {
  let cleaned = value.replace(/\D/g, "");

  cleaned = cleaned.slice(0, 10);

  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  } else {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
};

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",

    // Bank Deposit
    bankName: "",
    accountNumber: "",
    depositSlip: null,

    // COD
    codInstructions: "Payment will be collected upon delivery",

    // Common
    paymentNote: "",
  });

  useEffect(() => {
    const loadCart = () => {
      setLoading(true);

      if (location.state && Array.isArray(location.state)) {
        setCart(location.state);
      } else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setCart(parsedCart);
            }
          } catch (error) {
            console.error("Error parsing cart:", error);
          }
        }
      }

      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data) {
              setName(res.data.firstName + " " + (res.data.lastName || ""));
              setEmail(res.data.email || "");
              setPhone(res.data.phone || "");
            }
          })
          .catch(console.error);
      }

      setLoading(false);
    };

    loadCart();
  }, [location.state]);

  const paymentMethods = [
    {
      id: "credit_card",
      name: "Credit Card",
      icon: <FaCreditCard className="text-2xl" />,
      description: "Pay securely with your credit card",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      selectedColor: "bg-purple-100 border-purple-500",
      requiresDetails: true,
    },
    {
      id: "debit_card",
      name: "Debit Card",
      icon: <FaCreditCard className="text-2xl" />,
      description: "Pay with your debit card",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      selectedColor: "bg-blue-100 border-blue-500",
      requiresDetails: true,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <FaMoneyBillWave className="text-2xl" />,
      description: "Pay when you receive your order",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      selectedColor: "bg-green-100 border-green-500",
      requiresDetails: false,
    },
    {
      id: "bank_deposit",
      name: "Bank Deposit",
      icon: <FaUniversity className="text-2xl" />,
      description: "Transfer to our bank account",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      selectedColor: "bg-yellow-100 border-yellow-500",
      requiresDetails: true,
    },
  ];

  function getTotal() {
    if (!cart || !Array.isArray(cart)) return 0;

    let total = 0;
    cart.forEach((item) => {
      total += (item.price || 0) * (item.quantity || 0);
    });
    return total;
  }

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter shipping address");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
    if (!validateSriLankanMobile(cleanedPhone)) {
      toast.error(
        "Please enter a valid Sri Lankan mobile number (e.g., 07XXXXXXXX)"
      );
      return false;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }

    // Validate payment details based on method
    if (
      selectedPaymentMethod === "credit_card" ||
      selectedPaymentMethod === "debit_card"
    ) {
      if (!paymentDetails.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        toast.error("Please enter a valid 16-digit card number");
        return false;
      }
      if (!paymentDetails.cardHolder.trim()) {
        toast.error("Please enter card holder name");
        return false;
      }
      if (!paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (!paymentDetails.cvv.match(/^\d{3,4}$/)) {
        toast.error("Please enter a valid CVV (3-4 digits)");
        return false;
      }
    }

    if (selectedPaymentMethod === "bank_deposit") {
      if (!paymentDetails.bankName.trim()) {
        toast.error("Please enter bank name");
        return false;
      }
      if (!paymentDetails.accountNumber.trim()) {
        toast.error("Please enter account number");
        return false;
      }
    }

    return true;
  };

  async function processOrder() {
    const cleanedPhone = phone.replace(/\D/g, "");
    if (!validateSriLankanMobile(cleanedPhone)) {
      toast.error(
        "Please enter a valid Sri Lankan mobile number (10 digits starting with 07)"
      );
      return;
    }

    if (!validateForm()) return;

    setProcessingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const orderData = {
        orderID: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
        customerName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: cart.map((item) => ({
          productID: item.productID,
          name: item.name || "Product",
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || "/placeholder.png",
        })),
        total: getTotal(),
        status: "pending",
        paymentMethod: selectedPaymentMethod,

        paymentStatus:
          selectedPaymentMethod === "credit_card" ||
          selectedPaymentMethod === "debit_card"
            ? "pending"
            : "pending",

        paymentDetails: paymentDetails,
      };

      console.log("📦 Creating order with frontend ID:", orderData.orderID);

      const createOrderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Order creation response:", createOrderResponse.data);

      const createdOrder = createOrderResponse.data.order;
      console.log("✅ Order created with backend ID:", createdOrder.orderID);

      const actualOrderID = createdOrder.orderID;
      console.log("🎯 Actual order ID to use:", actualOrderID);

      if (
        selectedPaymentMethod === "cod" ||
        selectedPaymentMethod === "bank_deposit"
      ) {
        toast.success("Order placed successfully!");

        localStorage.setItem("cart", "[]");

        navigate("/order-confirmation", {
          state: {
            orderId: actualOrderID,
            paymentMethod: selectedPaymentMethod,
            total: createdOrder.total,
            status: "pending",
          },
        });
      } else if (
        selectedPaymentMethod === "credit_card" ||
        selectedPaymentMethod === "debit_card"
      ) {
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            ...orderData,
            orderID: actualOrderID,
            _id: createdOrder._id,
          })
        );

        localStorage.setItem("cart", "[]");

        navigate("/process-payment", {
          state: {
            ...orderData,
            orderID: actualOrderID,
            _id: createdOrder._id,
          },
        });
      }
    } catch (error) {
      console.error("❌ Order error:", error);
      console.error("Error details:", error.response?.data);

      if (error.response) {
        toast.error(
          error.response.data?.message ||
            `Order failed (${error.response.status})`
        );
      } else {
        toast.error(error.message || "Failed to place order");
      }
    } finally {
      setProcessingOrder(false);
    }
  }
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: formatted.slice(0, 19),
      }));
    } else if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2");
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: formatted.slice(0, 5),
      }));
    } else if (name === "cvv") {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, "").slice(0, 4),
      }));
    } else {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="w-full lg:h-[calc(100vh-100px)] bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message
  if (!cart || cart.length === 0) {
    return (
      <div className="w-full lg:h-[calc(100vh-100px)] bg-primary flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-secondary/70 mb-6">
            Add some products to your cart before checkout
          </p>
          <Link
            to="/products"
            className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition font-medium"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-primary p-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedPaymentMethod
                    ? "bg-green-500 text-white"
                    : "bg-accent text-white"
                }`}
              >
                1
              </div>
              <div className="w-24 h-1 bg-gray-300 mx-2"></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedPaymentMethod
                    ? "bg-accent text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                2
              </div>
              <div className="w-24 h-1 bg-gray-300 mx-2"></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedPaymentMethod
                    ? "bg-gray-300 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-center">
            <span className="font-medium">Cart</span>
            <span className="font-medium">Payment Method</span>
            <span className="font-medium">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ID: {item.productID}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              const newCart = [...cart];
                              if (newCart[index].quantity > 1) {
                                newCart[index].quantity -= 1;
                                setCart(newCart);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(newCart)
                                );
                              }
                            }}
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => {
                              const newCart = [...cart];
                              newCart[index].quantity += 1;
                              setCart(newCart);
                              localStorage.setItem(
                                "cart",
                                JSON.stringify(newCart)
                              );
                            }}
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                      {item.labelledPrice > item.price && (
                        <p className="text-sm text-gray-500 line-through">
                          LKR {item.labelledPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">
                Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                    <span className="text-xs text-gray-500 ml-1">
                      (Sri Lankan mobile)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const formatted = formatPhoneInput(e.target.value);
                      setPhone(formatted);

                      const cleaned = formatted.replace(/\D/g, "");
                      if (cleaned.length === 10) {
                        if (!validateSriLankanMobile(cleaned)) {
                          setPhoneError("Invalid mobile number format");
                        } else {
                          setPhoneError("");
                        }
                      } else if (cleaned.length > 0) {
                        setPhoneError("Must be 10 digits");
                      } else {
                        setPhoneError("");
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none ${
                      phoneError ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="077 123 4567"
                    required
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      Format: 07XXXXXXXX
                    </span>
                    {phoneError && (
                      <span className="text-xs text-red-500">{phoneError}</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    rows="3"
                    placeholder="Enter complete shipping address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">
                Select Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedPaymentMethod(method.id);
                      setShowPaymentDetails(true);
                    }}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center text-center transition-all ${
                      selectedPaymentMethod === method.id
                        ? method.selectedColor + " border-2"
                        : method.color + " border-gray-200"
                    }`}
                  >
                    <div className="mb-2">{method.icon}</div>
                    <h3 className="font-bold text-gray-800">{method.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {method.description}
                    </p>
                    {selectedPaymentMethod === method.id && (
                      <FaCheckCircle className="text-green-500 mt-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Payment Details Form */}
              {showPaymentDetails && selectedPaymentMethod && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-secondary mb-4">
                    {selectedPaymentMethod === "credit_card"
                      ? "Credit Card Details"
                      : selectedPaymentMethod === "debit_card"
                      ? "Debit Card Details"
                      : selectedPaymentMethod === "bank_deposit"
                      ? "Bank Deposit Details"
                      : "Cash on Delivery Instructions"}
                  </h3>

                  {/* Card Details */}
                  {(selectedPaymentMethod === "credit_card" ||
                    selectedPaymentMethod === "debit_card") && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={handleCardInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                          maxLength="19"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Holder Name *
                        </label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={paymentDetails.cardHolder}
                          onChange={handleCardInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentDetails.expiryDate}
                            onChange={handleCardInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV *
                          </label>
                          <input
                            type="password"
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handleCardInputChange}
                            placeholder="123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                            maxLength="4"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Deposit Details */}
                  {selectedPaymentMethod === "bank_deposit" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-bold text-blue-800 mb-2">
                          Bank Account Details:
                        </h4>
                        <p className="text-sm text-blue-700">
                          <strong>Bank:</strong> Commercial Bank
                          <br />
                          <strong>Account Name:</strong> Cristal Beauty Pvt Ltd
                          <br />
                          <strong>Account Number:</strong> 1234567890
                          <br />
                          <strong>Branch:</strong> Colombo 03
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Bank Name *
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={paymentDetails.bankName}
                          onChange={handleCardInputChange}
                          placeholder="e.g., Commercial Bank, HNB"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Account Number *
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={paymentDetails.accountNumber}
                          onChange={handleCardInputChange}
                          placeholder="Your bank account number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deposit Slip (Optional)
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setPaymentDetails((prev) => ({
                              ...prev,
                              depositSlip: file,
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                          accept="image/*,.pdf"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload screenshot of deposit slip (JPG, PNG, PDF)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* COD Instructions */}
                  {selectedPaymentMethod === "cod" && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FaMoneyBillWave className="text-green-500 text-xl mt-1" />
                        <div>
                          <h4 className="font-bold text-green-800">
                            Cash on Delivery
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            Pay with cash when your order is delivered. Our
                            delivery agent will collect the payment.
                          </p>
                          <ul className="text-sm text-green-700 mt-2 space-y-1">
                            <li>
                              ✓ Exact cash amount: LKR {getTotal().toFixed(2)}
                            </li>
                            <li>✓ Delivery agent will provide receipt</li>
                            <li>✓ No extra charges for COD</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Note */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="paymentNote"
                      value={paymentDetails.paymentNote}
                      onChange={handleCardInputChange}
                      placeholder="Any special instructions for your order..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      rows="2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-secondary mb-4">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>LKR {getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>LKR 0.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>LKR 0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-secondary pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>LKR {getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Secure Payment
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your payment information is encrypted and secure.
                </p>
              </div>

              <button
                onClick={processOrder}
                disabled={processingOrder || !selectedPaymentMethod}
                className="w-full mt-6 bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {selectedPaymentMethod === "cod"
                      ? "Place Order (COD)"
                      : selectedPaymentMethod === "bank_deposit"
                      ? "Confirm Bank Deposit"
                      : "Proceed to Payment"}
                  </>
                )}
              </button>

              {/* Back to Cart */}
              <Link
                to="/cart"
                className="block text-center mt-4 text-accent hover:underline text-sm"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
