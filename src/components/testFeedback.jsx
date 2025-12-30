import { useState } from "react";
import axios from "axios";

export default function TestFeedback() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const testAPI = async () => {
        setLoading(true);
        setResult("Testing...");
        
        try {
            const token = localStorage.getItem("token");
            
            // Test 1: Check if API endpoint exists
            const testRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/test`);
            setResult(prev => prev + "\n✓ Test endpoint working\n");
            
            // Test 2: Check authentication
            if (token) {
                const authRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResult(prev => prev + `✓ User authenticated: ${authRes.data.email}\n`);
            } else {
                setResult(prev => prev + "✗ No token found\n");
            }
            
            // Test 3: Try to submit feedback
            const testFeedback = {
                productID: "TEST123",
                rating: 5,
                review: "Test review from debug component"
            };
            
            const submitRes = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/feedback`,
                testFeedback,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setResult(prev => prev + `✓ Feedback submitted: ${submitRes.data.message}\n`);
            
        } catch (error) {
            setResult(prev => prev + `\n✗ Error: ${error.message}\n`);
            if (error.response) {
                setResult(prev => prev + `Status: ${error.response.status}\n`);
                setResult(prev => prev + `Data: ${JSON.stringify(error.response.data)}\n`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Feedback Debug Tool</h2>
            <button
                onClick={testAPI}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Testing..." : "Test Feedback API"}
            </button>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                    {result || "Click 'Test Feedback API' to start debugging"}
                </pre>
            </div>
        </div>
    );
}
