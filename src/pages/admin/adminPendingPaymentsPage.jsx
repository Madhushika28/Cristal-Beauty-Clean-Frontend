import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaMoneyBillWave, FaBuilding, FaTruck } from "react-icons/fa";

export default function AdminPendingPaymentsPage() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payments/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("📋 Pending payments API response:", res.data);

      if (res.data.success) {
        setPendingOrders(res.data.orders || []);
        if (res.data.orders?.length === 0) {
          setError("No pending payments found.");
        }
      } else {
        setError(res.data.message || "Failed to load pending payments");
        setPendingOrders([]);
      }
    } catch (error) {
      console.error("❌ Error fetching pending payments:", error);
      console.error("Error details:", error.response?.data);
      setError(
        error.response?.data?.message || "Failed to load pending payments"
      );
      setPendingOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (orderId, paymentMethod) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        paymentMethod === "bank_deposit"
          ? `/api/payments/confirm-bank/${orderId}`
          : `/api/payments/mark-cod-paid/${orderId}`;

      console.log(`Marking ${paymentMethod} order ${orderId} as paid`);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Payment marked as paid!");
        fetchPendingPayments(); // Refresh list
      } else {
        toast.error(response.data.message || "Failed to mark as paid");
      }
    } catch (error) {
      console.error("Error marking as paid:", error);
      toast.error(error.response?.data?.message || "Failed to mark as paid");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Pending Payment Confirmations
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pending payments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Pending Payment Confirmations
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchPendingPayments}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Payment Confirmations</h1>

      {pendingOrders.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700">No pending payments found.</p>
        </div>
      ) : (
        <>
          {/* Bank Deposits Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBuilding className="text-blue-500" /> Bank Deposits Awaiting
              Confirmation
            </h2>
            {pendingOrders.filter((o) => o.paymentMethod === "bank_deposit")
              .length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">No pending bank deposits</p>
              </div>
            ) : (
              pendingOrders
                .filter((o) => o.paymentMethod === "bank_deposit")
                .map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-4 rounded-lg shadow mb-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">Order #{order.orderID}</p>
                        <p className="text-sm text-gray-600">
                          {order.customerName}
                        </p>
                        <p className="text-sm">
                          Amount: LKR {order.total?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created:{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          markAsPaid(order.orderID, "bank_deposit")
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      >
                        Confirm Deposit Received
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* COD Deliveries Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaTruck className="text-green-500" /> COD Payments to Collect
            </h2>
            {pendingOrders.filter((o) => o.paymentMethod === "cod").length ===
            0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600">No pending COD orders</p>
              </div>
            ) : (
              pendingOrders
                .filter((o) => o.paymentMethod === "cod")
                .map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-4 rounded-lg shadow mb-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">Order #{order.orderID}</p>
                        <p className="text-sm text-gray-600">
                          {order.customerName} - {order.address}
                        </p>
                        <p className="text-sm">
                          Amount to collect: LKR {order.total?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created:{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => markAsPaid(order.orderID, "cod")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Mark as Paid (Collected)
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
