import { useState, useEffect } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCreditCard, FaLock, FaCalendarAlt, FaUser, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null); 
    
    
    useEffect(() => {
        const orderFromState = location.state;
        const orderFromStorage = localStorage.getItem("pendingOrder");
        
        if (orderFromState) {
            console.log('Order from state:', orderFromState);
            setOrderData(orderFromState);
        } else if (orderFromStorage) {
            try {
                const parsedOrder = JSON.parse(orderFromStorage);
                console.log('Order from storage:', parsedOrder);
                setOrderData(parsedOrder);
            } catch (error) {
                console.error('Error parsing order from storage:', error);
                toast.error("Invalid order data");
                navigate("/checkout");
            }
        } else {
            toast.error("No order found. Please complete checkout first.");
            navigate("/checkout");
        }
    }, [location.state, navigate]);

    // Form state
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        paymentMethod: "credit_card"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Format card number with spaces
        if (name === "cardNumber") {
            const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
            setCardDetails(prev => ({
                ...prev,
                [name]: formatted.slice(0, 19)
            }));
        }
        // Format expiry date
        else if (name === "expiryDate") {
            const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
            setCardDetails(prev => ({
                ...prev,
                [name]: formatted.slice(0, 5)
            }));
        }
        // Format CVV
        else if (name === "cvv") {
            setCardDetails(prev => ({
                ...prev,
                [name]: value.replace(/\D/g, "").slice(0, 4)
            }));
        }
        else {
            setCardDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateCardDetails = () => {
        if (!orderData) {
            toast.error("Order information missing");
            return false;
        }
        
        if (!cardDetails.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
            toast.error("Please enter a valid 16-digit card number");
            return false;
        }
        if (!cardDetails.cardHolder.trim()) {
            toast.error("Please enter card holder name");
            return false;
        }
        if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            toast.error("Please enter a valid expiry date (MM/YY)");
            return false;
        }
        if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
            toast.error("Please enter a valid CVV (3-4 digits)");
            return false;
        }
        return true;
    };

    const processPayment = async () => {
        if (!validateCardDetails()) return;
        
        setLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                toast.error("Please login to complete payment");
                setLoading(false);
                return;
            }
            
            if (!orderData || !orderData.orderID) {
                toast.error("Order information missing");
                setLoading(false);
                return;
            }
            
            console.log('Processing payment for order:', orderData.orderID);
            console.log('Order total:', orderData.total);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update order with payment info
            const paymentInfo = {
                paymentMethod: cardDetails.paymentMethod,
                paymentStatus: "paid",
                transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
                cardLastFour: cardDetails.cardNumber.replace(/\s/g, "").slice(-4),
                paidAmount: orderData.total || 0
            };
            
            console.log('Sending payment info:', paymentInfo);
            
            // Update order in backend
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderData.orderID}/payment`,
                paymentInfo,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Payment response:', response.data);
            
            if (response.data.success) {
                // Show success
                setPaymentSuccess(true);
                toast.success("Payment successful! Your order has been confirmed.");
                
                // Clear cart if not already cleared
                localStorage.setItem("cart", "[]");
                
                // Clear pending order
                localStorage.removeItem("pendingOrder");
                

                setTimeout(() => {
                    navigate("/orders");
                }, 3000);
            } else {
                toast.error(response.data.message || "Payment failed");
            }
            
        } catch (error) {
            console.error("Payment error:", error);
            
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
                toast.error(error.response.data?.message || `Payment failed (${error.response.status})`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("Server not responding. Please check your connection.");
            } else {
                console.error("Request setup error:", error.message);
                toast.error("Payment failed: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    
    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary">Loading order information...</p>
                </div>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheckCircle className="text-4xl text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">
                            Your payment of <span className="font-bold text-green-600">LKR {orderData.total?.toFixed(2) || "0.00"}</span> has been processed.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600">Order ID: <span className="font-mono font-bold">{orderData.orderID}</span></p>
                            <p className="text-sm text-gray-600 mt-1">You will be redirected to your orders...</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                    >
                        View Your Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary to-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate("/checkout")}
                    className="flex items-center gap-2 text-secondary hover:text-accent mb-6 group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium">Back to Checkout</span>
                </button>

                {/* Order Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="text-blue-500 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-blue-800">
                                <strong>Order #{orderData.orderID}</strong> • Total: LKR {orderData.total?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                {orderData.items?.length || 0} item(s) • Complete payment to confirm your order
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
                                <FaCreditCard className="text-accent" />
                                Payment Details
                            </h2>
                            
                            
                        </div>
                    </div>

                
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-secondary mb-4">Order Summary</h3>
                            
                            <div className="space-y-3 mb-6">
                                {orderData.items?.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={item.image || "/placeholder.png"} 
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/placeholder.png";
                                                }}
                                            />
                                            <div>
                                                <p className="font-medium text-sm text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            LKR {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-lg font-bold text-secondary pt-3">
                                    <span>Total</span>
                                    <span>LKR {orderData.total?.toFixed(2) || "0.00"}</span>
                                </div>
                            </div>

                            <button
                                onClick={processPayment}
                                disabled={loading || !orderData}
                                className="w-full mt-6 bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle />
                                        Pay LKR {orderData.total?.toFixed(2) || "0.00"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}