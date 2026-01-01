import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RatingStars from "./ratingStars";
import { Loader } from "./loader";
import FeedbackForm from "./feedbackForm";

export default function ProductFeedback({ productID }) {
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userFeedback, setUserFeedback] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/feedback/product/${productID}/stats`
      );
      setStats(statsRes.data);

      const feedbackRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/feedback/product/${productID}`
      );
      setFeedbacks(feedbackRes.data.feedbacks || []);
      setUserFeedback(feedbackRes.data.userFeedback || null);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load feedback data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [productID]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getRatingPercentage = (rating) => {
    if (!stats || !stats.ratingBreakdown || stats.totalRatings === 0) return 0;
    const count = stats.ratingBreakdown[rating] || 0;
    return Math.round((count / stats.totalRatings) * 100);
  };

  const handleFeedbackSuccess = async (newFeedback) => {
    try {
      setRefreshing(true);

      setUserFeedback(newFeedback);

      await loadData();

      console.log("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error refreshing after feedback:", error);
    }
  };
  const handleHelpfulClick = async (feedbackId, currentCount) => {
    const likedFeedbacks = JSON.parse(
      localStorage.getItem("likedFeedbacks") || "[]"
    );

    if (likedFeedbacks.includes(feedbackId)) {
      toast.error("You already liked this review!");
      return;
    }

    try {
      const updatedFeedbacks = feedbacks.map((fb) =>
        fb._id === feedbackId ? { ...fb, helpfulCount: currentCount + 1 } : fb
      );
      setFeedbacks(updatedFeedbacks);

      likedFeedbacks.push(feedbackId);
      localStorage.setItem("likedFeedbacks", JSON.stringify(likedFeedbacks));

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/feedback/${feedbackId}/helpful`
      );

      toast.success("Thanks for your feedback!");
    } catch (error) {
      console.error("Error marking as helpful:", error);
      toast.error("Failed to mark as helpful");

      const updatedLikes = likedFeedbacks.filter((id) => id !== feedbackId);
      localStorage.setItem("likedFeedbacks", JSON.stringify(updatedLikes));

      const revertedFeedbacks = feedbacks.map((fb) =>
        fb._id === feedbackId ? { ...fb, helpfulCount: currentCount } : fb
      );
      setFeedbacks(revertedFeedbacks);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {refreshing && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Updating reviews...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {stats && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Customer Reviews Summary
                </h3>
                {refreshing && (
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Updating...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {stats.averageRating?.toFixed(1) || "0.0"}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <svg
                          className="w-8 h-8 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <RatingStars
                        rating={stats.averageRating || 0}
                        size="text-xl"
                        showNumber={false}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        {stats.totalRatings || 0} ratings •{" "}
                        {stats.totalReviews || 0} reviews
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">
                      Rating Breakdown
                    </h4>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-8">
                          {rating} ★
                        </span>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${getRatingPercentage(rating)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {getRatingPercentage(rating)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Verified Purchases
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Reviews from confirmed buyers
                        </p>
                      </div>
                      <div className="bg-white rounded-full p-3 shadow-sm">
                        <span className="text-2xl font-bold text-emerald-600">
                          {stats.verifiedPurchases || 0}
                        </span>
                      </div>
                    </div>
                    {stats.verifiedPurchases > 0 && (
                      <div className="mt-4 text-xs text-emerald-600">
                        ✓ These reviews are from customers who purchased this
                        product
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.totalRatings || 0}
                      </div>
                      <div className="text-sm text-blue-700 font-medium mt-1">
                        Total Ratings
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.totalReviews || 0}
                      </div>
                      <div className="text-sm text-purple-700 font-medium mt-1">
                        Written Reviews
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Customer Reviews
                <span className="ml-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {feedbacks.length}
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                  <option>Most Helpful</option>
                </select>
              </div>
            </div>

            {userFeedback && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <h4 className="font-semibold text-gray-900">Your Review</h4>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    ✓ You reviewed this product
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={userFeedback.userImage}
                      alt={userFeedback.userName}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {userFeedback.userName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars
                          rating={userFeedback.rating}
                          size="text-sm"
                          showNumber={false}
                        />
                        <span className="text-xs text-gray-500">
                          {new Date(
                            userFeedback.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {userFeedback.review && (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {userFeedback.review}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-blue-600 italic">
                    You can update your review using the form on the right
                  </p>
                </div>
              </div>
            )}

            {feedbacks.filter(
              (fb) => !userFeedback || fb._id !== userFeedback._id
            ).length > 0 ? (
              <div className="space-y-4">
                {feedbacks
                  .filter((fb) => !userFeedback || fb._id !== userFeedback._id)
                  .map((feedback, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={feedback.userImage}
                            alt={feedback.userName}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {feedback.userName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <RatingStars
                                rating={feedback.rating}
                                size="text-sm"
                                showNumber={false}
                              />
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  feedback.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {feedback.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified Purchase
                          </span>
                        )}
                      </div>

                      {feedback.review && (
                        <p className="mt-4 text-gray-700 leading-relaxed">
                          {feedback.review}
                        </p>
                      )}

                      {feedback.images && feedback.images.length > 0 && (
                        <div className="flex gap-2 mt-4">
                          {feedback.images.slice(0, 3).map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img}
                              alt={`Review image ${imgIndex + 1}`}
                              className="w-20 h-20 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          ))}
                          {feedback.images.length > 3 && (
                            <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-sm text-gray-500 font-medium">
                              +{feedback.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Was this review helpful?
                        </span>
                        <button
                          onClick={() =>
                            handleHelpfulClick(
                              feedback._id,
                              feedback.helpfulCount || 0
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={JSON.parse(
                            localStorage.getItem("likedFeedbacks") || "[]"
                          ).includes(feedback._id)}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          Helpful ({feedback.helpfulCount || 0})
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : !userFeedback ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to share your thoughts about this product!
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <FeedbackForm
            productID={productID}
            userFeedback={userFeedback}
            onSuccess={handleFeedbackSuccess}
          />

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Review Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Be honest and share your actual experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Include specific details about product quality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Focus on the product features and performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span>Don't include personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span>Avoid promotional or spam content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
