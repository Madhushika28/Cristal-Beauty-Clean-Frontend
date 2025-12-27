import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineMessage, MdShoppingCartCheckout } from "react-icons/md";
import { BsBox2Heart } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/addNewProduct";
import UpdateProductPage from "./admin/adminUpdateProduct";
import AdminOrdersPage from "./admin/adminOrdersPage";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import AdminUsersPage from "./admin/usersPage";
import AdminContactPage from "./admin/adminContactPage";
import DashboardHome from "./admin/adminDashboard";

export default function AdminPage() {
  const navigate = useNavigate();
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access admin panel");
      navigate("/login");
      return;
    }
    axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.data.role !== "admin") {
        toast.error("You are not authorized to access admin panel");
        navigate("/");
        return;
      }
      setUserLoaded(true);
    }).catch(() => {
      toast.error("Session expired. Please login again");
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  }, []);

  const sidebarItems = [
    { label: "Dashboard", icon: <FaChartLine />, path: "/admin" },
    { label: "Orders", icon: <MdShoppingCartCheckout />, path: "/admin/orders" },
    { label: "Products", icon: <BsBox2Heart />, path: "/admin/products" },
    { label: "Contact Messages", icon: <MdOutlineMessage />, path: "/admin/contact" },
    { label: "Users", icon: <HiOutlineUsers />, path: "/admin/users" },
  ];

  return (
    <div className="w-full h-full bg-primary flex text-secondary">
      {/* Sidebar */}
      <div className="w-[300px] h-full bg-primary flex flex-col items-center gap-4 py-6">
        <div className="flex items-center w-[90%] h-[70px] bg-accent rounded-2xl mb-6 px-4">
          <img src="/logo.png" alt="CBC Logo" className="h-[60px]" />
          <span className="text-white text-xl font-bold ml-4">Admin Panel</span>
        </div>

        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="w-[90%] flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium hover:bg-[var(--color-accent)] hover:text-white transition"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-[calc(100%-300px)] h-full border-[4px] border-accent rounded-[20px] overflow-hidden p-4">
        <div className="h-full w-full max-h-full overflow-y-scroll">
          {userLoaded ? (
            <Routes path="/">
              <Route path="" element={<DashboardHome />} />
              <Route path="/products" element={<AdminProductPage />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/add-product" element={<AddProductPage />} />
              <Route path="/update-product" element={<UpdateProductPage />} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/contact" element={<AdminContactPage />} />
            </Routes>
          ) : <Loader />}
        </div>
      </div>
    </div>
  );
}
