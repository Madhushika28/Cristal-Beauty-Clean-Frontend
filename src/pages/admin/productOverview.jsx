import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import { Loader } from "../../components/loader";
import { addToCart } from "../../utils/cart";

export default function ProductOverview() {
	const params = useParams();
	// loading, success, error
	const [status, setStatus] = useState("loading");
	const [product, setProduct] = useState(null);

	// track which image is active in slider
	const [activeImage, setActiveImage] = useState(0);

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_API_URL + "/api/products/" + params.id)
			.then((res) => {
				setProduct(res.data);
				setStatus("success");
			})
			.catch(() => {
				toast.error("Failed to fetch product details");
				setStatus("error");
			});
	}, []);

	if (!product) return null;

	return (
		<div className="relative w-full lg:h-[calc(100vh-100px)] overflow-hidden text-secondary">

			{/* Blurred Background */}
<div className="absolute inset-0 overflow-hidden">
  {product?.images.map((img, i) => (
    <div
      key={i}
      className={`absolute inset-0 bg-cover bg-center blur-sm transition-opacity duration-500 ${
        i === activeImage ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: `url(${img})` }}
    />
  ))}
</div>

{/* Dark overlay */}
<div className="absolute inset-0 bg-black/50" />




			{/* Page Content */}
			<div className="relative z-10 w-full flex flex-col lg:flex-row p-10 gap-10">

				{/* Product Image Card */}
				<div className="w-full lg:w-[50%] bg-white/90 rounded-2xl p-5 flex flex-col items-center shadow-lg">
					<ImageSlider
						images={product?.images}
						// Track selected image index
						onImageChange={(index) => setActiveImage(index)}
					/>
				</div>

				{/* Product Info Card */}
				<div className="w-full lg:w-[50%] bg-white/90 rounded-2xl p-10 flex flex-col gap-4 shadow-lg">
					<span className="text-sm text-gray-500">{product.productID}</span>
					<h1 className="text-2xl font-bold">
						{product.name}
						{product?.altNames?.map((name, index) => (
							<span key={index} className="font-normal text-secondary">{" | " + name}</span>
						))}
					</h1>

					{/* Description */}
					<p className="text-justify">{product.description}</p>

					{/* Category */}
					<p>Category: {product.category}</p>

					{/* Price */}
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
						<p className="text-lg text-accent font-semibold">LKR {product.price.toFixed(2)}</p>
					)}

					{/* Buttons */}
					<div className="flex gap-4 mt-6">
						<button
							className="w-[50%] h-[40px] bg-accent text-white font-semibold hover:bg-accent/80"
							onClick={() => { addToCart(product, 1); toast.success("Added to cart"); }}
						>
							Add to Cart
						</button>
						<Link
							to="/checkout"
							state={[{
								image: product.images[0],
								productID: product.productID,
								name: product.name,
								price: product.price,
								labelledPrice: product.labelledPrice,
								quantity: 1
							}]}
							className="w-[50%] h-[40px] flex justify-center items-center border border-accent text-accent font-semibold hover:bg-accent hover:text-white"
						>
							Buy Now
						</Link>
					</div>
				</div>
			</div>

			{/* Loading & Error states */}
			{status == "loading" && <Loader />}
			{status == "error" && <h1 className="text-red-500">Failed to load product details</h1>}
		</div>
	);
}
