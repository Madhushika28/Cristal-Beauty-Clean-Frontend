
import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import ImageSlider from "../../components/imageSlider";
import RatingStars from "../../components/ratingStars";
import FeedbackForm from "../../components/feedbackForm";
import { Loader } from "../../components/loader";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../../utils/cart";
import ProductFeedback from "../../components/productFeedback";

export default function ProductOverview() {
    const params = useParams();
    const [status, setStatus] = useState("loading");
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [user, setUser] = useState(null);
    const [userFeedback, setUserFeedback] = useState(null);

    useEffect(() => {
        let isMounted = true;
        
        // Load product data
        axios
            .get(import.meta.env.VITE_API_URL + "/api/products/" + params.id)
            .then((res) => {
                if (isMounted) {
                    setProduct(res.data);
                    setStatus("success");
                }
            })
            .catch(() => {
                if (isMounted) {
                    toast.error("Failed to fetch product details");
                    setStatus("error");
                }
            });

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (token && isMounted) {
            axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                if (isMounted) setUser(res.data);
            })
            .catch(() => {
                if (isMounted) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            });
        }

        // Load user's feedback if logged in
        if (token && params.id && isMounted) {
            loadUserFeedback(params.id, token);
        }
        
        return () => {
            isMounted = false;
        };
    }, [params.id]);

    const loadUserFeedback = async (productID, token) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/feedback/product/${productID}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserFeedback(response.data.userFeedback);
        } catch (error) {
            console.error("Error loading user feedback:", error);
        }
    };

    const handleFeedbackSuccess = (feedback) => {
        setUserFeedback(feedback);
        // Refresh product data to update ratings
        axios
            .get(import.meta.env.VITE_API_URL + "/api/products/" + params.id)
            .then((res) => {
                setProduct(res.data);
            })
            .catch(() => {
                toast.error("Failed to update product ratings");
            });
    };

    if (!product && status === "loading") return <Loader />;
    if (!product && status === "error") return <h1 className="text-red-500">Failed to load product details</h1>;

    return (
        <div className="relative w-full min-h-screen overflow-hidden text-secondary bg-primary">
            {/* Product Details Section */}
            <div className="w-full bg-gradient-to-b from-white to-primary/50 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="mb-6 text-sm text-gray-600">
                        <Link to="/" className="hover:text-accent">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/products" className="hover:text-accent">Products</Link>
                        <span className="mx-2">/</span>
                        <span className="text-secondary font-medium">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Column - Images */}
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <ImageSlider
                                    images={product.images}
                                    onImageChange={(index) => setActiveImage(index)}
                                />
                            </div>

                            {/* Additional Info */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-secondary mb-4">Product Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Product ID:</span>
                                        <p className="font-medium">{product.productID}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Category:</span>
                                        <p className="font-medium capitalize">{product.category}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Stock:</span>
                                        <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                {/* Product Title */}
                                <h1 className="text-3xl font-bold text-secondary mb-2">{product.name}</h1>
                                
                               
                                {product.altName && product.altName.length > 0 && (
                                    <p className="text-gray-600 mb-4">
                                        Also known as: {product.altName.join(", ")}
                                    </p>
                                )}

                                {/* Rating Display */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <RatingStars
                                            rating={product.averageRating || 0} 
                                            size="text-xl"
                                            showNumber={true}
                                        />
                                        <span className="text-sm text-gray-500">
                                            ({product.totalRatings || 0} ratings)
                                        </span>
                                    </div>
                                    {product.totalReviews > 0 && (
                                        <span className="text-sm text-gray-500">
                                            • {product.totalReviews} reviews
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    {product.labelledPrice > product.price ? (
                                        <div className="flex items-center gap-4">
                                            <p className="text-3xl font-bold text-accent">
                                                LKR {product.price.toFixed(2)}
                                            </p>
                                            <div className="flex flex-col">
                                                <p className="text-lg text-gray-400 line-through">
                                                    LKR {product.labelledPrice.toFixed(2)}
                                                </p>
                                                <span className="text-sm font-medium text-green-600">
                                                    Save LKR {(product.labelledPrice - product.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-3xl font-bold text-accent">
                                            LKR {product.price.toFixed(2)}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-secondary mb-3">Description</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => { 
                                            // Added image check
                                            if (product.images && product.images[0]) {
                                                addToCart(product, 1); 
                                                toast.success("Added to cart");
                                            } else {
                                                toast.error("Product image not available");
                                            }
                                        }}
                                        disabled={product.stock <= 0}
                                    >
                                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                    </button>
                                    <Link
                                        to="/checkout"
                                        state={[{
                                            image: product.images[0] || "/placeholder-image.png", // Added fallback
                                            productID: product.productID,
                                            name: product.name,
                                            price: product.price,
                                            labelledPrice: product.labelledPrice,
                                            quantity: 1
                                        }]}
                                        className={`flex-1 flex justify-center items-center border border-accent font-semibold py-3 rounded-lg transition ${
                                            product.stock > 0 
                                                ? "text-accent hover:bg-accent hover:text-white" 
                                                : "text-gray-400 border-gray-400 cursor-not-allowed"
                                        }`}
                                        onClick={(e) => {
                                            if (product.stock <= 0) {
                                                e.preventDefault();
                                                toast.error("Product is out of stock");
                                            }
                                        }}
                                    >
                                        Buy Now
                                    </Link>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>📦 Free shipping on orders over LKR 5000</span>
                                        <span>🔄 30-day return policy</span>
                                        <span>🔒 Secure payment</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Breakdown (if available) */}
                            {(product.totalRatings || 0) > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <h3 className="text-lg font-semibold text-secondary mb-4">Customer Reviews</h3>
                                    <div className="space-y-3">
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = product.ratingBreakdown?.[star] || 0;
                                            const percentage = product.totalRatings ? 
                                                Math.round((count / product.totalRatings) * 100) : 0;
                                            
                                            return (
                                                <div key={star} className="flex items-center gap-3">
                                                    <span className="text-sm w-12">{star} ★</span>
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-yellow-400"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-10 text-right">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Write Review (if logged in) */}
                    {user && (
                        <div className="lg:col-span-1">
                            <FeedbackForm
                                productID={product.productID}
                                userFeedback={userFeedback}
                                onSuccess={handleFeedbackSuccess}
                            />
                        </div>
                    )}

                    {/* Right Column - All Reviews */}
                    <div className={user ? "lg:col-span-2" : "lg:col-span-3"}>
                        <ProductFeedback productID={product.productID} />
                    </div>
                </div>
            </div>

            {/* Similar Products Section (Optional) */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold text-secondary mb-6">You May Also Like</h2>
                {/* You can add a similar products carousel here */}
                <div className="text-center text-gray-500 py-8">
                    Similar products feature coming soon...
                </div>
            </div>
        </div>
    );
}