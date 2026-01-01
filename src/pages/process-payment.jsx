import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function ProcessPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("processing");

  useEffect(() => {
    const orderFromState = location.state;
    const orderFromStorage = localStorage.getItem("pendingOrder");

    if (orderFromState) {
      setOrderData(orderFromState);
    } else if (orderFromStorage) {
      try {
        setOrderData(JSON.parse(orderFromStorage));
      } catch (error) {
        toast.error("Invalid order data");
        navigate("/checkout");
      }
    } else {
      toast.error("No order found");
      navigate("/checkout");
    }
  }, [location.state, navigate]);

  const processCardPayment = async () => {
    if (!orderData) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentInfo = {
        paymentMethod: orderData.paymentMethod,
        paymentStatus: "paid",
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        cardLastFour:
          orderData.paymentDetails?.cardNumber?.replace(/\s/g, "").slice(-4) ||
          "1234",
        paidAmount: orderData.total,
        paymentDetails: orderData.paymentDetails,
      };

      const orderIdToUse = orderData.orderID;

      console.log("💰 Processing payment for order:", orderIdToUse);
      console.log("📤 Order data in payment page:", orderData);
      console.log(
        "📤 Sending to:",
        `${import.meta.env.VITE_API_URL}/api/payments/process/${orderIdToUse}`
      );

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/payments/process/${orderIdToUse}`,
        paymentInfo,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Payment response:", response.data);

      if (response.data.success) {
        setPaymentStatus("success");
        toast.success("Payment successful!");

        localStorage.removeItem("pendingOrder");

        setTimeout(() => {
          navigate("/order-confirmation", {
            state: {
              orderId: orderData.orderID,
              paymentMethod: orderData.paymentMethod,
              transactionId: paymentInfo.transactionId,
              total: orderData.total,
              status: "paid",
            },
          });
        }, 3000);
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("❌ Payment error:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(
          error.response.data?.message ||
            `Payment failed (${error.response.status})`
        );
      } else if (error.request) {
        console.error("No response received");
        toast.error("Server not responding. Please try again.");
      } else {
        toast.error("Payment failed: " + error.message);
      }

      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-accent text-white p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaCreditCard className="text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Card Payment</h1>
            <p className="text-white/80">Order #{orderData.orderID}</p>
          </div>

          {/* Payment Status */}
          <div className="p-6">
            {paymentStatus === "processing" && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FaLock className="text-3xl text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Secure Payment
                  </h2>
                  <p className="text-gray-600">
                    Processing your{" "}
                    {orderData.paymentMethod === "credit_card"
                      ? "credit card"
                      : "debit card"}{" "}
                    payment
                  </p>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-accent">
                      LKR {orderData.total?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Card:</span>
                    <span className="font-mono">
                      **** **** ****{" "}
                      {orderData.paymentDetails?.cardNumber
                        ?.replace(/\s/g, "")
                        .slice(-4) || "****"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Holder:</span>
                    <span>
                      {orderData.paymentDetails?.cardHolder || "Card Holder"}
                    </span>
                  </div>
                </div>

                {/* Process Button */}
                <button
                  onClick={processCardPayment}
                  disabled={loading}
                  className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  <FaLock className="inline mr-1" />
                  This is a mock payment system. No real transactions are
                  processed.
                </p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-3xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your payment of LKR {orderData.total?.toFixed(2)} has been
                  processed.
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-700">
                    Order #{orderData.orderID} has been confirmed.
                    <br />
                    You will be redirected to order confirmation...
                  </p>
                </div>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FaExclamationTriangle className="text-3xl text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  There was an issue processing your payment. Please try again.
                </p>
                <button
                  onClick={() => setPaymentStatus("processing")}
                  className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition mb-3"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full border border-accent text-accent py-3 rounded-lg font-semibold hover:bg-accent/10 transition"
                >
                  Back to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
