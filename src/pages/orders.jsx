import { useEffect, useState } from "react";
import axios from "axios";
import { FaBox,FaTruck,FaCheckCircle,FaTimesCircle,FaClock,FaShoppingBag,} from "react-icons/fa";
import { Loader } from "../components/loader";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "processing":
        return <FaBox className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-indigo-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-primary p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-secondary hover:text-accent transition-colors group bg-primary/50 hover:bg-accent/10 px-4 py-2 rounded-lg border border-secondary/10"
          >
            <svg
              className="w-5 h-5 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Back to Previous</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <FaShoppingBag className="text-2xl text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary">My Orders</h1>
              <p className="text-secondary/70">
                Track and manage all your purchases
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary/10">
              <div className="text-2xl font-bold text-secondary">
                {orders.length}
              </div>
              <div className="text-sm text-secondary/70">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary/10">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "completed").length}
              </div>
              <div className="text-sm text-secondary/70">Completed</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary/10">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "processing").length}
              </div>
              <div className="text-sm text-secondary/70">Processing</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary/10">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "pending").length}
              </div>
              <div className="text-sm text-secondary/70">Pending</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary/10">
              <div className="text-2xl font-bold text-accent">
                LKR{" "}
                {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </div>
              <div className="text-sm text-secondary/70">Total Spent</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === "all"
                  ? "bg-accent text-white"
                  : "bg-white text-secondary border border-secondary/10 hover:bg-accent/10"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-white text-secondary border border-secondary/10 hover:bg-yellow-50"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("processing")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === "processing"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-white text-secondary border border-secondary/10 hover:bg-blue-50"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter("shipped")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === "shipped"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-white text-secondary border border-secondary/10 hover:bg-indigo-50"
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-white text-secondary border border-secondary/10 hover:bg-green-50"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-secondary/10">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-3xl text-secondary/40" />
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">
                No orders found
              </h3>
              <p className="text-secondary/70 mb-4">
                You haven't placed any orders yet
              </p>
              <a
                href="/"
                className="inline-block bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="divide-y divide-secondary/10">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-6 hover:bg-primary/50 transition-colors cursor-pointer"
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder?._id === order._id ? null : order
                    )
                  }
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-bold text-secondary">
                            Order #{order.orderID}
                          </h3>
                          <p className="text-sm text-secondary/70">
                            Placed on{" "}
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <span className="text-secondary/70">
                          {order.items?.length || 0} items
                        </span>
                        <span className="font-bold text-accent">
                          LKR {order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="text-sm text-accent hover:text-accent/80 font-medium">
                        Track Order
                      </button>
                      <button className="text-sm bg-accent/10 text-accent px-4 py-2 rounded-lg hover:bg-accent/20 transition">
                        View Details
                      </button>

                      {order.paymentStatus === "pending" && (
                        <Link
                          to={`/payment/${order.orderID}`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Pay Now
                        </Link>
                      )}
                    </div>
                  </div>

                  {selectedOrder?._id === order._id && (
                    <div className="mt-6 pt-6 border-t border-secondary/10">
                      <h4 className="font-semibold text-secondary mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 bg-primary/30 rounded-lg"
                          >
                            <img
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h5 className="font-medium text-secondary">
                                {item.name}
                              </h5>
                              <p className="text-sm text-secondary/70">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="ml-auto text-right">
                              <p className="font-medium text-secondary">
                                LKR {item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-secondary/70">
                                Total: LKR{" "}
                                {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-primary/30 p-4 rounded-lg">
                          <h5 className="font-semibold text-secondary mb-2">
                            Shipping Address
                          </h5>
                          <p className="text-sm text-secondary/70">
                            {order.shippingAddress?.street}
                            <br />
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state}
                            <br />
                            {order.shippingAddress?.zipCode}
                          </p>
                        </div>
                        <div className="bg-primary/30 p-4 rounded-lg">
                          <h5 className="font-semibold text-secondary mb-2">
                            Payment Method
                          </h5>
                          <p className="text-sm text-secondary/70">
                            {order.paymentMethod}
                          </p>
                          <div className="mt-2">
                            {order.paymentStatus === "paid" ? (
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-medium">
                                  ✓ Paid
                                </span>
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  Transaction ID: {order.transactionId || "N/A"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2">
                                <span className="text-yellow-600 font-medium">
                                  Pending Payment
                                </span>
                                <Link
                                  to={`/payment/${order.orderID}`}
                                  className="w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                >
                                  Complete Payment
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-primary/30 p-4 rounded-lg">
                          <h5 className="font-semibold text-secondary mb-2">
                            Order Summary
                          </h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>
                                LKR{" "}
                                {order.subtotal?.toFixed(2) ||
                                  order.total.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>
                                LKR {order.shippingFee?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-accent border-t border-secondary/10 pt-2 mt-2">
                              <span>Total</span>
                              <span>LKR {order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-secondary mb-2">
                Need help with your orders?
              </h3>
              <p className="text-secondary/70">
                Contact our customer support for assistance
              </p>
            </div>
            <a
              href="/contact"
              className="mt-4 md:mt-0 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
