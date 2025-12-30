import { Link } from "react-router-dom";
import RatingStars from "./ratingStars";

export default function ProductCard(props) {
    const product = props.product;
    
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "/placeholder-image.png";
    };

    return (
        <div className="w-[300px] shadow-2xl m-3 flex flex-col bg-white rounded-xl">
            {/* Fixed image section */}
            <div className="h-[250px]">
                <img 
                    className="w-full h-full object-cover rounded-t-xl" 
                    src={product.images[0] || "/placeholder-image.png"} 
                    alt={product.name}
                    onError={handleImageError}
                />
            </div>
            
            {/* Content section that grows but is constrained */}
            <div className="flex-1 min-h-[150px] max-h-[200px] p-4 flex flex-col">
                <h1 className="text-xl font-bold text-secondary line-clamp-2 mb-2">
                    {product.name}
                </h1>
                
                <div className="flex items-center gap-2 mb-2">
                    <RatingStars rating={product.averageRating} size="text-sm" showNumber={true} />
                    <span className="text-sm text-gray-500">
                        ({product.totalRatings})
                    </span>
                </div>
                
                <div className="mb-2">
                    {product.labelledPrice > product.price ? (
                        <div className="flex gap-3 items-center">
                            <p className="text-lg text-secondary font-semibold line-through">
                                LKR {product.labelledPrice.toFixed(2)}
                            </p>
                            <p className="text-lg text-accent font-semibold">
                                LKR {product.price.toFixed(2)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-lg text-accent font-semibold">
                            LKR {product.price.toFixed(2)}
                        </p>
                    )}
                </div>
                
                {/* This section will push button down if needed */}
                <div className="mt-auto">
                    <p className="text-sm text-secondary/70 truncate">{product.productID}</p>
                    <p className="text-sm text-secondary/70 truncate">{product.category}</p>
                </div>
            </div>
            
            {/* Fixed button at bottom */}
            <div className="p-4 pt-0">
                <Link 
                    to={"/overview/"+product.productID} 
                    className="w-full h-[40px] border text-center border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition flex items-center justify-center"
                >
                    View Product
                </Link>
            </div>
        </div>
    );
}