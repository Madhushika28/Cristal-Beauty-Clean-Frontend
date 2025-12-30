import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../../components/loader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaShoppingCart, FaUsers, FaEnvelope, FaBoxOpen, FaArrowUp, FaChartLine, FaExclamationTriangle, FaTrophy, FaCalendarAlt, FaUserPlus } from "react-icons/fa";

export default function DashboardHome() {
  const [stats, setStats] = useState({ orders: 0, users: 0, messages: 0, products: 0 });
  const [ordersChart, setOrdersChart] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchStats() {
      try {
        const [ordersRes, usersRes, messagesRes, productsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/all-users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/contact`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setStats({
          orders: ordersRes.data.length,
          users: usersRes.data.length,
          messages: messagesRes.data.length,
          products: productsRes.data.length,
        });

        const chartData = ordersRes.data.reduce((acc, order) => {
          const date = new Date(order.date).toLocaleDateString();
          const found = acc.find((item) => item.date === date);
          if (found) found.orders += 1;
          else acc.push({ date, orders: 1 });
          return acc;
        }, []);
        setOrdersChart(chartData.slice(-7));

        setLowStockProducts(productsRes.data.filter(p => p.stock <= 5));
        setTopProducts([...productsRes.data].sort((a,b)=>b.sold-b.sold).slice(0,5));
        setRecentOrders([...ordersRes.data].sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,10));
        setRecentUsers([...usersRes.data].sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)).slice(0,10));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statIcons = {
    orders: <FaShoppingCart className="text-3xl text-accent" />,
    users: <FaUsers className="text-3xl text-secondary" />,
    messages: <FaEnvelope className="text-3xl text-green-500" />,
    products: <FaBoxOpen className="text-3xl text-purple-500" />
  };

  return (
    <div className="p-6 w-full space-y-6 bg-primary min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary/90 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-primary/80">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* 1️⃣ Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-secondary/10">
            <div className="flex items-center justify-between mb-4">
              {statIcons[key]}
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                <FaArrowUp className="text-xs" />
                12%
              </span>
            </div>
            <h3 className="text-sm font-medium text-secondary/70 uppercase tracking-wider">{key}</h3>
            <p className="text-3xl font-bold text-secondary mt-2">{value}</p>
            <div className="mt-4 pt-4 border-t border-secondary/10">
              <span className="text-xs text-secondary/60">+{Math.floor(value * 0.12)} from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2️⃣ Orders Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-secondary mb-1">Orders Analytics</h3>
            <p className="text-secondary/70">Last 7 days order trends</p>
          </div>
          <div className="flex items-center gap-2 text-accent bg-accent/10 px-4 py-2 rounded-full">
            <FaChartLine />
            <span className="font-medium">Trending Up</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ordersChart}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#888888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb"
              }}
              labelStyle={{ color: "#374151", fontWeight: "bold" }}
            />
            <Bar 
              dataKey="orders" 
              fill="#CD2C58" 
              radius={[10, 10, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3️⃣ Products Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
              <FaExclamationTriangle className="text-accent" />
              Low Stock Products
            </h3>
            <span className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full">
              {lowStockProducts.length} items
            </span>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
              <div key={p._id} className="flex items-center justify-between p-3 hover:bg-accent/5 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <FaBoxOpen className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary group-hover:text-accent">{p.name}</h4>
                    <p className="text-xs text-secondary/60">ID: {p.productID}</p>
                  </div>
                </div>
                <span className="text-accent font-bold text-lg bg-accent/10 px-3 py-1 rounded-full">{p.stock}</span>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <FaBoxOpen className="text-green-500 text-2xl" />
                </div>
                <p className="text-secondary/70 font-medium">All products have sufficient stock</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              Top Selling Products
            </h3>
            <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              Best Sellers
            </span>
          </div>
          <div className="space-y-3">
            {topProducts.length > 0 ? topProducts.map((p,i)=>(
              <div key={p._id} className="flex items-center justify-between p-3 hover:bg-yellow-50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-secondary">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary group-hover:text-accent truncate max-w-[200px]">{p.name}</h4>
                    <p className="text-xs text-secondary/60">LKR {p.price.toFixed(2)}</p>
                  </div>
                </div>
                <span className="text-accent font-bold bg-accent/10 px-3 py-1 rounded-full">{p.sold} sold</span>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-3">
                  <FaChartLine className="text-secondary/60 text-2xl" />
                </div>
                <p className="text-secondary/70 font-medium">No sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4️⃣ Orders Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
              <FaCalendarAlt className="text-accent" />
              Recent Orders
            </h3>
            <span className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full">
              Latest {recentOrders.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-l-lg">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {recentOrders.map(o=>(
                  <tr key={o._id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-secondary">{o.orderID}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-secondary">{o.customerName}</div>
                      <div className="text-xs text-secondary/60">{o.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-accent">LKR {o.total.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        o.status === 'completed' ? 'bg-green-100 text-green-800' :
                        o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        o.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-secondary/10 text-secondary'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
<div className="bg-white rounded-2xl shadow-xl p-6 border border-secondary/10">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
      <FaUserPlus className="text-secondary" />
      Recent Users
    </h3>
    <span className="text-xs font-medium bg-secondary/10 text-secondary px-3 py-1 rounded-full">
      New Signups
    </span>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px]">
      <thead>
        <tr className="bg-secondary text-white">
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-1/3">Name</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-2/5">Email</th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-1/4">Role</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-secondary/10">
        {recentUsers.map(u=>(
          <tr key={u._id} className="hover:bg-accent/5 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-secondary">
                    {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-secondary truncate">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-secondary/60 truncate">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-secondary/80 truncate">{u.email}</td>
            <td className="px-4 py-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
              }`}>
                {u.role}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      </div>
    </div>
  );
}