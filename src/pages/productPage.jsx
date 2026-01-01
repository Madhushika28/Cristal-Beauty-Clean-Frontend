import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("🌐 Fetching from:", import.meta.env.VITE_API_URL + "/api/products");
                
                const response = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
                console.log("✅ Products loaded:", response.data.length);
                setProducts(response.data);
            } catch (error) {
                console.error("❌ Error fetching products:", error);
                console.error("❌ Error details:", error.message);
                console.error("❌ API URL used:", import.meta.env.VITE_API_URL);
                
                // Try with hardcoded URL for debugging
                try {
                    console.log("🔄 Trying hardcoded URL...");
                    const hardcodedResponse = await axios.get("https://cristal-beauty-clean-backend.onrender.com/api/products");
                    setProducts(hardcodedResponse.data);
                    console.log("✅ Hardcoded URL worked!");
                } catch (hardcodedError) {
                    console.error("❌ Hardcoded also failed:", hardcodedError);
                    toast.error("Failed to load products. Check console for details.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = async (value) => {
        setSearchTerm(value);
        
        try {
            if (value.trim() === "") {
                // Reset to all products
                setIsLoading(true);
                const response = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
                setProducts(response.data);
                setIsLoading(false);
            } else {
                // Search products
                const searchResult = await axios.get(
                    import.meta.env.VITE_API_URL + "/api/products/search/" + encodeURIComponent(value)
                );
                setProducts(searchResult.data);
                
                if (searchResult.data.length === 0) {
                    toast("No products found", { icon: "🔍" });
                }
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Search failed");
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] bg-primary">
            <div className="w-full h-[100px] flex justify-center items-center">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search products..." 
                    className="px-4 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50 w-full max-w-md" 
                />
            </div>
            
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full h-full flex flex-row flex-wrap justify-center bg-primary p-4">
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary mb-2">No products found</h3>
                            <p className="text-secondary/70">Try a different search term</p>
                        </div>
                    ) : (
                        products.map((item) => (
                            <ProductCard key={item.productID || item._id} product={item} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}