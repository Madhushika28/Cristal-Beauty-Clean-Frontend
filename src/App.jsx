import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import productCard from "./components/productCard.jsx";
import AdminPage from "./pages/adminPage.jsx";
import HomePage from "./pages/homaPage.jsx";
import TestPage from "./pages/test";
import LoginPage from "./pages/loginPage";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/registerPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPassword from "./pages/forget-password.jsx";



function App() {
	return (
		<BrowserRouter>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<div className="w-full h-[100vh] ">
					<Toaster position="top-right" />
					<Routes path="/">
						<Route path="/*" element={<HomePage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/forget-password" element={<ForgetPassword />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/admin/*" element={<AdminPage />} />
						<Route path="/test" element={<TestPage />} />
					</Routes>
				</div>
			</GoogleOAuthProvider>
		</BrowserRouter>
	);
}

export default App;