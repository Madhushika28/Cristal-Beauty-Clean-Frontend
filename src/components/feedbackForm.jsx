import { useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import toast from "react-hot-toast";
import RatingStars from "./ratingStars";

export default function FeedbackForm({ productID, userFeedback = null, onSuccess }) {
    const [rating, setRating] = useState(userFeedback?.rating || 0);
    const [review, setReview] = useState(userFeedback?.review || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync props with state when userFeedback changes
    useEffect(() => {
        setRating(userFeedback?.rating || 0);
        setReview(userFeedback?.review || "");
    }, [userFeedback]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Submit clicked");
        console.log("Product ID:", productID);
        console.log("Rating:", rating);
        console.log("Review:", review);
        
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        
        console.log("Token exists:", !!token);
        console.log("API URL:", import.meta.env.VITE_API_URL);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/feedback`,
                {
                    productID,
                    rating,
                    review
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Response:", response);
            console.log("Response data:", response.data);

            toast.success(response.data.message);

            // Only reset if it's a new feedback submission, not an update
            if (!userFeedback) {
                setReview("");
                setRating(0);
            }
            
            if (onSuccess) {
                onSuccess(response.data.feedback);
            }
        } catch (error) {
            console.error("Error details:", error);
            console.error("Error response:", error.response);
            
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
                console.error("Headers:", error.response.headers);
                
                toast.error(error.response.data?.message || `Error ${error.response.status}`);
                
                if (error.response.status === 401) {
                    toast.error("Please login to submit feedback");
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    return; // Added return
                }
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("No response from server. Check your connection.");
            } else {
                console.error("Request setup error:", error.message);
                toast.error("Failed to submit feedback: " + error.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-secondary mb-4">
                {userFeedback ? "Update Your Review" : "Write a Review"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Selection */}
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        Rating *
                    </label>
                    <div className="flex items-center gap-2">
                        <RatingStars
                            interactive={true}
                            value={rating}
                            onChange={setRating}
                            size="text-2xl"
                        />
                        <span className="ml-2 text-sm text-gray-500">
                            {rating > 0 ? `${rating} out of 5` : "Select rating"}
                        </span>
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                        Review (Optional)
                    </label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full px-4 py-3 rounded-lg border border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                        rows="4"
                        maxLength="500"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {review.length}/500 characters
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </span>
                        ) : userFeedback ? (
                            "Update Review"
                        ) : (
                            "Submit Review"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}