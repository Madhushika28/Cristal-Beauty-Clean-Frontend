import { useState } from "react";

export default function ImageSlider({ images, onImageChange }) {
	const [activeImage, setActiveImage] = useState(0);

	const handleClick = (index) => {
		setActiveImage(index);
		if (onImageChange) {
			onImageChange(index); // notify parent
		}
	};

	return (
		<div className="w-[400px]">
			<img className="w-full h-[400px] object-cover rounded-lg" src={images[activeImage]} />

			<div className="w-full h-[100px] flex justify-center items-center gap-2 mt-2">
				{images.map((img, index) => (
					<img
						key={index}
						onClick={() => handleClick(index)}
						className={`w-[90px] h-[90px] object-cover rounded-lg cursor-pointer transition-all ${
							activeImage === index ? "border-[4px] border-accent" : ""
						}`}
						src={img}
					/>
				))}
			</div>
		</div>
	);
}
