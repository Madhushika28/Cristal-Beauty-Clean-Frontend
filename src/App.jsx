import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminPage from "./pages/adminPage.jsx";
import HomePage from "./pages/homePage.jsx";
import TestPage from "./pages/test";
import LoginPage from "./pages/loginPage";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/registerPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPassword from "./pages/forget-password.jsx";
import UserSettings from "./pages/settings.jsx";
import { Link } from "react-router-dom"; // Add for 404 page
import OrdersPage from "./pages/orders.jsx";

// 404 Component
const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
            <Link to="/" className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition">
                Go Back Home
            </Link>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <div className="w-full h-[100vh]">
                    <Toaster 
                        position="top-right" 
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                theme: {
                                    primary: 'green',
                                    secondary: 'black',
                                },
                            },
                            error: {
                                duration: 4000,
                            },
                        }}
                    />
                    <Routes>
                        <Route path="/*" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forget-password" element={<ForgetPassword />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin/*" element={<AdminPage />} />
                        <Route path="/test" element={<TestPage />} />
                        <Route path="/settings" element={<UserSettings />} />
                        <Route path="/orders" element={<OrdersPage/>} />
                       
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </GoogleOAuthProvider>
        </BrowserRouter>
    );
}

export default App;