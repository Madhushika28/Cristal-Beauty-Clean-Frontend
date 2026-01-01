import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaPrint,
  FaEnvelope,
  FaShoppingBag,
  FaHome,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function OrderConfirmation() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (location.state) {
      setOrderDetails(location.state);
    } else {
      const savedOrder = localStorage.getItem("lastOrder");
      if (savedOrder) {
        setOrderDetails(JSON.parse(savedOrder));
      }
    }
    localStorage.setItem("cart", "[]");
  }, [location.state]);

  const printOrder = () => {
    window.print();
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading order details...</p>
        </div>
      </div>
    );
  }

  const paymentMethodNames = {
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    cod: "Cash on Delivery",
    bank_deposit: "Bank Deposit",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Order #{orderDetails.orderId}
              </h2>
              <p className="text-gray-600">
                {new Date().toLocaleDateString()} •{" "}
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={printOrder}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaPrint />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FaEnvelope />
                Email
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Payment Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Payment Method:</span>
                    <span className="font-medium">
                      {paymentMethodNames[orderDetails.paymentMethod] ||
                        orderDetails.paymentMethod}
                    </span>
                  </div>
                  {orderDetails.transactionId && (
                    <div className="flex justify-between mb-2">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-sm">
                        {orderDetails.transactionId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-bold text-green-600">
                      LKR {orderDetails.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Order Status
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">Order Received</p>
                      <p className="text-sm text-gray-600">
                        We're preparing your order
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      You will receive an email confirmation shortly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-4">
            {orderDetails.paymentMethod === "cod" && (
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMoneyBillWave className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Cash on Delivery
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Please keep exact cash amount (LKR{" "}
                    {orderDetails.total?.toFixed(2)}) ready for our delivery
                    agent.
                  </p>
                </div>
              </div>
            )}

            {orderDetails.paymentMethod === "bank_deposit" && (
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Bank Deposit Instructions
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Please email your deposit slip to payments@cristalbeauty.com
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaShoppingBag className="text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Track Your Order
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  You can track your order status in the "My Orders" section.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition"
          >
            <FaShoppingBag />
            View My Orders
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/10 transition"
          >
            <FaHome />
            Continue Shopping
          </Link>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Need help? Contact our customer support at support@cristalbeauty.com
            or call +94 77 123 4567
          </p>
        </div>
      </div>
    </div>
  );
}
