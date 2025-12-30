import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import mediaUpload from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserSettings() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [image, setImage] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
        axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName); 
            setUser(res.data);           
        }).catch(() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
        });
    }, []);

	async function updateUserData() {
		try {
			let imageUrl = user?.image;

			if (image) {
				imageUrl = await mediaUpload(image);
			}

			const data = {
				firstName,
				lastName,
				image: imageUrl,
			};

			await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me",
				data,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			toast.success("Profile updated successfully");
			navigate("/");
		} catch (err) {
			console.error(err);
			toast.error("Failed to update profile");
		}
	}

	async function updatePassword() {
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		await axios.put(import.meta.env.VITE_API_URL + "/api/users/me/password", {
			password: password,
		},{
			headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
		}).then(()=>{
			toast.success("Password updated successfully");
			setPassword("");
			setConfirmPassword("");
		}).catch((err)=>{
			console.error("Error updating password:", err);
			toast.error("Failed to update password");
		});
		navigate("/")
	};

	const imagePreview = useMemo(() => {
		if (image) return URL.createObjectURL(image);
		if (user?.image) return user.image;
		return "";
	}, [image, user]);

	const pwdMismatch =
		password && confirmPassword && password !== confirmPassword;

	return (
		<div className="min-h-screen bg-primary">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent/10 to-transparent" />
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/5 to-transparent" />
			
			<div className="relative container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
				{/* Header */}
				<div className="text-center mb-10 lg:mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-3">
						Account Settings
					</h1>
					<p className="text-secondary/70 max-w-md mx-auto text-sm sm:text-base">
						Manage your personal information and security
					</p>
				</div>

				{/* Main Content - Responsive Cards */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
					{/* Profile Card */}
					<div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 border border-secondary/5">
						<div className="flex items-center gap-4 sm:gap-5 mb-7">
							<div className="relative">
								<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
									{imagePreview ? (
										<img
											src={imagePreview}
											alt="Profile"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full bg-accent flex items-center justify-center text-white text-lg sm:text-xl font-bold">
											{firstName?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || "U"}
										</div>
									)}
								</div>
								<label className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 sm:p-2 shadow-md cursor-pointer border border-secondary/10 hover:scale-110 transition-transform">
									<svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<input
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(e) => {
											const f = e.target.files?.[0] || null;
											setImage(f);
										}}
									/>
								</label>
							</div>
							<div>
								<h2 className="text-lg sm:text-xl font-bold text-secondary">
									Profile Details
								</h2>
								<p className="text-secondary/60 text-xs sm:text-sm">
									Update your personal information
								</p>
							</div>
						</div>

						<div className="space-y-5">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-secondary mb-2">
										First Name
									</label>
									<input
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										className="w-full px-4 py-2.5 rounded-lg bg-primary border border-secondary/10 text-secondary placeholder:text-secondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
										placeholder="First name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-secondary mb-2">
										Last Name
									</label>
									<input
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										className="w-full px-4 py-2.5 rounded-lg bg-primary border border-secondary/10 text-secondary placeholder:text-secondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
										placeholder="Last name"
									/>
								</div>
							</div>
							
							<button
								onClick={updateUserData}
								className="w-full bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all shadow-md"
							>
								Save Profile
							</button>
						</div>
					</div>

					{/* Password Card */}
					<div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 border border-secondary/5">
						<div className="flex items-center gap-4 sm:gap-5 mb-7">
							<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent/10 flex items-center justify-center">
								<svg className="w-6 h-6 sm:w-7 sm:h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<div>
								<h2 className="text-lg sm:text-xl font-bold text-secondary">
									Change Password
								</h2>
								<p className="text-secondary/60 text-xs sm:text-sm">
									Secure your account with a new password
								</p>
							</div>
						</div>

						<div className="space-y-5">
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-secondary mb-2">
										New Password
									</label>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-4 py-2.5 rounded-lg bg-primary border border-secondary/10 text-secondary placeholder:text-secondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
										placeholder="••••••••"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-secondary mb-2">
										Confirm Password
									</label>
									<input
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="w-full px-4 py-2.5 rounded-lg bg-primary border border-secondary/10 text-secondary placeholder:text-secondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
										placeholder="••••••••"
									/>
								</div>

								{pwdMismatch && (
									<div className="flex items-center gap-2 text-red-500 text-sm">
										<svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
										</svg>
										<span>Passwords do not match</span>
									</div>
								)}
							</div>

							<button
								onClick={updatePassword}
								disabled={!password || !confirmPassword || pwdMismatch}
								className="w-full bg-secondary text-white font-semibold py-3 rounded-lg hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary"
							>
								Update Password
							</button>
							
							<div className="pt-3 border-t border-secondary/10">
								<div className="flex items-start gap-2 text-xs text-secondary/50">
									<svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
									</svg>
									<span>Make sure your password is at least 8 characters long and includes numbers and symbols.</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Back Button */}
				<div className="mt-10 text-center">
					<button
						onClick={() => navigate("/")}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-colors"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Home
					</button>
				</div>
			</div>
		</div>
	);
}