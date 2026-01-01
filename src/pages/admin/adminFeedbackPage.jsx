import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Loader } from "../../components/loader";
import RatingStars from "../../components/ratingStars";
import { FaCheck, FaTimes, FaEye, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("token");

  // Fetch feedbacks
  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/feedback`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      setFeedbacks(res.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, token]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Update feedback status
  const updateStatus = async (feedbackId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/feedback/${feedbackId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Feedback ${status}`);
      fetchFeedbacks();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Delete feedback
  const deleteFeedback = async (feedbackId) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/feedback/${feedbackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Feedback deleted");
      fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const classes = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-full p-6">
      <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-6 py-4">
          <h1 className="text-lg font-semibold text-secondary">
            Customer Feedback
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 rounded-lg border border-secondary/10 focus:border-accent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {feedbacks.length} feedback{feedbacks.length !== 1 && "s"}
            </span>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase">
                  Rating
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase">
                  Review
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {feedbacks.map((fb) => (
                <tr
                  key={fb._id}
                  className="hover:bg-accent/5 transition-colors"
                >
                  {/* Product Info */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{fb.productID}</div>
                  </td>

                  {/* User Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={fb.userImage}
                        alt={fb.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{fb.userName}</div>
                        <div className="text-xs text-gray-500">
                          {fb.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3">
                    <RatingStars rating={fb.rating} size="text-sm" />
                  </td>

                  {/* Review */}
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-sm line-clamp-2">
                      {fb.review || "No review text"}
                    </div>
                    {fb.images?.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {fb.images.length} photo{fb.images.length !== 1 && "s"}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">{getStatusBadge(fb.status)}</td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {fb.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(fb._id, "approved")}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => updateStatus(fb._id, "rejected")}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          window.open(`/overview/${fb.productID}`, "_blank")
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Product"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => deleteFeedback(fb._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {feedbacks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No feedback found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
