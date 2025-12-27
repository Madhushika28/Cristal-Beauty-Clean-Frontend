import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../../components/loader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
        setOrdersChart(chartData);

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

  return (
    <div className="p-6 w-full space-y-6">
      {/* 1️⃣ Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-accent/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-sm font-medium text-secondary capitalize">{key}</h3>
            <p className="text-2xl font-bold text-accent mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* 2️⃣ Orders Chart */}
      <div className="bg-primary rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">Orders Per Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ordersChart}>
            <XAxis dataKey="date" stroke="#888888" />
            <YAxis allowDecimals={false} stroke="#888888" />
            <Tooltip contentStyle={{ backgroundColor: "#fef3e2", borderRadius: "8px" }} />
            <Bar dataKey="orders" fill="#CD2C58" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3️⃣ Products Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-secondary mb-2">Low Stock Products</h3>
          <ul className="space-y-1">
            {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
              <li key={p._id} className="flex justify-between px-3 py-1 hover:bg-accent/10 rounded-md transition">{p.name}<span className="text-red-500 font-bold">{p.stock}</span></li>
            )) : <li className="px-3 py-2 text-secondary/70">No low stock products</li>}
          </ul>
        </div>
        <div className="bg-primary rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-secondary mb-2">Top Selling Products</h3>
          <ul className="space-y-1">
            {topProducts.length > 0 ? topProducts.map((p,i)=>(
              <li key={p._id} className="flex justify-between px-3 py-1 hover:bg-accent/10 rounded-md transition">{p.name}<span className="font-bold">{p.sold} sold</span></li>
            )): <li className="px-3 py-2 text-secondary/70">No sales data</li>}
          </ul>
        </div>
      </div>

      {/* 4️⃣ Orders Insights */}
      <div className="bg-primary rounded-2xl shadow-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-secondary mb-2">Recent Orders</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary text-white">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(o=>(
              <tr key={o._id} className="odd:bg-white even:bg-primary/10 hover:bg-accent/5 transition">
                <td className="px-4 py-2">{o.orderID}</td>
                <td className="px-4 py-2">{o.customerName}</td>
                <td className="px-4 py-2">LKR {o.total.toFixed(2)}</td>
                <td className="px-4 py-2">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5️⃣ Users Insights */}
      <div className="bg-primary rounded-2xl shadow-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-secondary mb-2">Recent Users</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary text-white">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(u=>(
              <tr key={u._id} className="odd:bg-white even:bg-primary/10 hover:bg-accent/5 transition">
                <td className="px-4 py-2">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
