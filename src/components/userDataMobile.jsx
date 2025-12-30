import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "./loader";

export default function UserDataMobile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token != null) {
            axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                setUser(res.data);
                setLoading(false);
            }).catch(() => {
                localStorage.removeItem("token");
                setUser(null);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="flex justify-center items-center">
            {isLogoutConfirmOpen && (
                <div className="fixed z-[120] w-full h-screen top-0 left-0 bg-black/30">
                    <div className="w-[300px] h-[150px] bg-primary rounded-lg p-4 flex flex-col justify-between items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <span className="text-lg">Are you sure you want to logout?</span>
                        <div className="w-full flex justify-around">
                            <button 
                                type="button"
                                className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary transition" 
                                onClick={handleLogout}
                            >
                                Yes
                            </button>
                            <button 
                                type="button"
                                className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary transition" 
                                onClick={() => setIsLogoutConfirmOpen(false)}
                            >
                                No
                            </button>
                        </div>
                        <div className="w-full flex justify-center">
                            <button 
                                type="button"
                                className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary transition" 
                                onClick={() => setIsLogoutConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading && <div className="w-[30px] h-[30px] border-[3px] border-white border-b-transparent rounded-full animate-spin"></div>}
            
            {user && (
                <div className="h-full w-full flex justify-center items-center">
                    <img 
                        src={user.image} 
                        className="w-[40px] h-[40px] rounded-full border-[2px] border-primary object-cover"
                        alt={user.firstName || "User"}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
                        }}
                    />
                    <span className="ml-2">{user.firstName}</span>
                    <select
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) => {
                            const value = e.target.value;
                            
                            switch (value) {
                                case "settings":
                                    window.location.href = "/settings";
                                    break;
                                case "orders":
                                    window.location.href = "/orders";
                                    break;
                                case "logout":
                                    setIsLogoutConfirmOpen(true);
                                    break;
                                default:
                                    break;
                            }
                            
                            e.target.selectedIndex = 0;
                        }}
                        className="ml-2 bg-accent text-white p-1 rounded cursor-pointer"
                        aria-label="User menu"
                    >
                        <option value="">⋮</option>
                        <option value="settings">Account Settings</option>
                        <option value="orders">Orders</option>
                        <option value="logout">Logout</option>
                    </select>
                </div>
            )}

            {(!loading && user == null) && (
                <a 
                    href="/login" 
                    className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary transition"
                >
                    Login
                </a>
            )}
        </div>
    );
}