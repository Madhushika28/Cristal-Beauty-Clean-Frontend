import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../../components/loader";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaChartLine,
  FaUsers,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (payments.length > 0) {
      const methods = payments.reduce((acc, payment) => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
        return acc;
      }, {});
      console.log("📊 Payment methods distribution in current data:", methods);
    }
  }, [payments]);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [currentPage, paymentMethodFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found in localStorage");
        setPayments([]);
        setLoading(false);
        return;
      }

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };
      if (paymentMethodFilter !== "all") {
        params.paymentMethod = paymentMethodFilter;
      }

      console.log("🔍 Fetching payments with params:", params);
      console.log(
        "🔗 API URL:",
        `${import.meta.env.VITE_API_URL}/api/payments`
      );

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
        }
      );

      console.log("📊 Payments API response:", res.data);

      if (res.data.success) {
        setPayments(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
        console.log(`✅ Loaded ${res.data.orders?.length || 0} payments`);
      } else {
        console.error("❌ Failed to fetch payments:", res.data.message);
        setPayments([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      setPayments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token for stats");
        return;
      }

      console.log(
        "📈 Fetching stats from:",
        `${import.meta.env.VITE_API_URL}/api/payments/stats`
      );

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payments/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📈 Stats API response:", res.data);

      if (res.data.success) {
        setStats(res.data);
      } else {
        console.error("❌ Failed to fetch stats:", res.data.message);
        setStats({
          stats: { totalRevenue: 0, totalTransactions: 0, avgTransaction: 0 },
          dailyStats: [],
        });
      }
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      console.error("❌ Error details:", error.response?.data);
      setStats({
        stats: { totalRevenue: 0, totalTransactions: 0, avgTransaction: 0 },
        dailyStats: [],
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount || 0);
  };

  const paymentMethodColors = {
    credit_card: "#8884d8",
    debit_card: "#82ca9d",
    cod: "#ffc658",
    bank_deposit: "#ff8042",
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary mb-2">
          Payment Dashboard
        </h1>
        <p className="text-secondary/70">View and manage customer payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary/70 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-secondary">
                {formatCurrency(stats?.stats?.totalRevenue || 0)}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaMoneyBillWave className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary/70 mb-1">
                Total Transactions
              </p>
              <h3 className="text-2xl font-bold text-secondary">
                {stats?.stats?.totalTransactions || 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCreditCard className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary/70 mb-1">Avg Transaction</p>
              <h3 className="text-2xl font-bold text-secondary">
                {formatCurrency(stats?.stats?.avgTransaction || 0)}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaChartLine className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary/70 mb-1">Paid Customers</p>
              <h3 className="text-2xl font-bold text-secondary">
                {payments.length}
              </h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaUsers className="text-2xl text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-secondary/10">
          <h3 className="text-lg font-semibold text-secondary mb-4">
            Daily Revenue (Last 7 Days)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.dailyStats || []}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                />
                <Bar
                  dataKey="dailyRevenue"
                  fill="#CD2C58"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-secondary/10">
          <h3 className="text-lg font-semibold text-secondary mb-4">
            Payment Methods Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minHeight={288}>
              <PieChart>
                <Pie
                  data={Object.entries(paymentMethodColors)
                    .map(([method, color]) => {
                      const count = payments.filter(
                        (p) => p.paymentMethod === method
                      ).length;
                      return {
                        name:
                          method === "cod"
                            ? "COD"
                            : method === "bank_deposit"
                            ? "Bank Deposit"
                            : method.replace("_", " ").toUpperCase(),
                        value: count,
                        color,
                      };
                    })
                    .filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(paymentMethodColors).map(
                    ([method, color], index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} orders (${(
                      (value / payments.length) *
                      100
                    ).toFixed(1)}%)`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-lg border border-secondary/10">
        <div className="p-6 border-b border-secondary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-secondary">
              Payment History
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchPayments()}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              >
                <option value="all">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="cod">COD</option>
                <option value="bank_deposit">Bank Deposit</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {payments.map((payment) => (
                <tr key={payment.transactionId} className="hover:bg-primary/50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium">
                      {payment.orderID}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{payment.customerName}</p>
                      <p className="text-sm text-gray-500">{payment.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {payment.paymentMethod === "cod"
                        ? "COD"
                        : payment.paymentMethod === "bank_deposit"
                        ? "Bank Deposit"
                        : payment.paymentMethod === "credit_card"
                        ? "Credit Card"
                        : payment.paymentMethod === "debit_card"
                        ? "Debit Card"
                        : payment.paymentMethod
                            ?.replace("_", " ")
                            .toUpperCase() || "N/A"}
                    </span>
                    {payment.cardLastFour && (
                      <p className="text-xs text-gray-500 mt-1">
                        **** {payment.cardLastFour}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-accent">
                    {formatCurrency(payment.paidAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm">
                      {payment.transactionId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : payment.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-secondary/10 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
