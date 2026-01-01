import { useState, useEffect } from "react"; 
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function RatingStars({ 
    rating, 
    size = "text-lg", 
    showNumber = false,
    interactive = false,
    onChange = null,
    value = 0 
}) {
    const [hoverRating, setHoverRating] = useState(0);
    const [tempRating, setTempRating] = useState(value);

    
    useEffect(() => {
        setTempRating(value);
    }, [value]);

    const renderStars = (currentRating) => {
        const stars = [];
        const fullStars = Math.floor(currentRating);
        const hasHalfStar = currentRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

       
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FaStar
                    key={`full-${i}`}
                    className={`${size} text-yellow-400 ${interactive ? "cursor-pointer" : ""}`}
                    onMouseEnter={() => interactive && setHoverRating(i + 1)}
                    onClick={() => interactive && onChange && onChange(i + 1)}
                />
            );
        }

        
        if (hasHalfStar) {
            stars.push(
                <FaStarHalfAlt
                    key="half"
                    className={`${size} text-yellow-400 ${interactive ? "cursor-pointer" : ""}`}
                    onMouseEnter={() => interactive && setHoverRating(fullStars + 0.5)}
                    onClick={() => interactive && onChange && onChange(fullStars + 0.5)}
                />
            );
        }

        
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <FaRegStar
                    key={`empty-${i}`}
                    className={`${size} text-yellow-400 ${interactive ? "cursor-pointer" : ""}`}
                    onMouseEnter={() => interactive && setHoverRating(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
                    onClick={() => interactive && onChange && onChange(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
                />
            );
        }

        return stars;
    };

    const displayRating = interactive ? (hoverRating || tempRating) : rating;

    return (
        <div className="flex items-center gap-2">
            <div className="flex" onMouseLeave={() => interactive && setHoverRating(0)}>
                {renderStars(displayRating)}
            </div>
            {showNumber && (
                <span className="text-sm font-semibold text-gray-600">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}