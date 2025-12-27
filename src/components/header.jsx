import { useState } from "react";
import { BsCart3 } from "react-icons/bs";
import { MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import UserData from "./userData";
import UserDataMobile from "./userDataMobile";

export default function Header() {

	const [isSideBarOpen, setIsSidebarOpen] = useState(false);

	return (
		<header className="w-full bg-accent h-[100px] text-white px-[40px] shadow-md">
			<div className="w-full h-full flex relative items-center">
				{/* Logo */}
				<img
					src="/logo.png"
					className="hidden lg:flex h-full absolute w-[170px] left-0 object-cover"
				/>
				<div className="lg:hidden w-full relative flex justify-center items-center">
					<MdMenu
						className="absolute left-0 text-3xl cursor-pointer hover:text-primary transition"
						onClick={() => setIsSidebarOpen(true)}
					/>
					<img src="/logo.png" className="h-full w-[170px] object-cover" />
				</div>

				{/* Mobile Sidebar */}
				{isSideBarOpen && (
					<div className="fixed top-0 left-0 w-full h-screen bg-black/70 text-secondary z-[100]">
						<div className="w-[300px] bg-primary h-full flex flex-col relative shadow-xl">
							<div className="lg:hidden h-[100px] w-full bg-accent relative flex justify-center items-center">
								<MdMenu
									className="absolute left-2 text-white text-3xl cursor-pointer hover:text-primary transition"
									onClick={() => setIsSidebarOpen(false)}
								/>
								<img
									src="/logo.png"
									className="h-full w-[170px] object-cover"
								/>
							</div>

							{/* Sidebar Links as Buttons */}
							<a href="/" className="p-4 border-b border-secondary/10 rounded-lg mx-2 my-1 hover:bg-accent hover:text-white transition text-center">
								Home
							</a>
							<a href="/products" className="p-4 border-b border-secondary/10 rounded-lg mx-2 my-1 hover:bg-accent hover:text-white transition text-center">
								Products
							</a>
							<a href="/about" className="p-4 border-b border-secondary/10 rounded-lg mx-2 my-1 hover:bg-accent hover:text-white transition text-center">
								About
							</a>
							<a href="/contact" className="p-4 border-b border-secondary/10 rounded-lg mx-2 my-1 hover:bg-accent hover:text-white transition text-center">
								Contact
							</a>
							<a href="/cart" className="p-4 border-b border-secondary/10 rounded-lg mx-2 my-1 hover:bg-accent hover:text-white transition text-center">
								Cart
							</a>

							<div className="lg:hidden flex w-[300px] absolute bottom-[20px] left-0 justify-center items-center gap-4">
								<UserDataMobile />
							</div>
						</div>
					</div>
				)}

				{/* Desktop Links as Buttons */}
				<div className="hidden h-full lg:flex justify-center items-center w-full text-lg gap-[20px]">
					<Link
						to="/"
						className="px-4 py-2 rounded-lg hover:bg-primary hover:text-accent transition font-medium shadow-sm"
					>
						Home
					</Link>
					<Link
						to="/products"
						className="px-4 py-2 rounded-lg hover:bg-primary hover:text-accent transition font-medium shadow-sm"
					>
						Products
					</Link>
					<Link
						to="/about"
						className="px-4 py-2 rounded-lg hover:bg-primary hover:text-accent transition font-medium shadow-sm"
					>
						About
					</Link>
					<Link
						to="/contact"
						className="px-4 py-2 rounded-lg hover:bg-primary hover:text-accent transition font-medium shadow-sm"
					>
						Contact
					</Link>
				</div>

				{/* User */}
				<div className="h-full hidden lg:flex w-[200px] absolute right-[100px] top-0 justify-end items-center gap-4">
					<UserData />
				</div>

				{/* Cart */}
				<Link
					to="/cart"
					className="h-full absolute right-0 hidden text-3xl lg:flex justify-center items-center hover:text-primary transition"
				>
					<BsCart3 />
				</Link>
			</div>
		</header>
	);
}
