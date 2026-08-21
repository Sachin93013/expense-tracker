import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  IndianRupee,
  LogOut,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(error.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const categoryData = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => {
      const existingCategory = acc.find(
        (item) => item.name === transaction.category,
      );
      if (existingCategory) {
        existingCategory.value += Number(transaction.amount);
      } else {
        acc.push({
          name: transaction.category,
          value: Number(transaction.amount),
        });
      }

      return acc;
    }, []);

  const incomeExpenseData = [
    {
      name: "Income",
      amount: totalIncome,
    },
    {
      name: "Expense",
      amount: totalExpense,
    },
  ];

  const balance = totalIncome - totalExpense;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }
  if (error) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center">
        <p className="font-medium text-red-600">
          {error}
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Financial Overview
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Welcome, {user?.name || "User"} 👋
            </h1>

            <p className="mt-2 text-gray-500">
              Track and manage your money in one place.
            </p>
          </div>

          <Link
            to="/transactions/add"
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Income */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-green-50 p-3">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>

              <span className="text-sm font-medium text-gray-400">Income</span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Income
            </p>

            <h2 className="mt-1 flex items-center text-2xl font-bold text-green-600">
              <IndianRupee className="h-5 w-5" />
              {formatAmount(totalIncome)}
            </h2>
          </div>

          {/* Expense */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-red-50 p-3">
                <ArrowDownCircle className="h-6 w-6 text-red-500" />
              </div>

              <span className="text-sm font-medium text-gray-400">Expense</span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Expense
            </p>

            <h2 className="mt-1 flex items-center text-2xl font-bold text-red-500">
              <IndianRupee className="h-5 w-5" />
              {formatAmount(totalExpense)}
            </h2>
          </div>

          {/* Balance */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>

              <span className="text-sm font-medium text-gray-400">Balance</span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Current Balance
            </p>

            <h2
              className={`mt-1 flex items-center text-2xl font-bold ${
                balance >= 0 ? "text-blue-600" : "text-red-500"
              }`}
            >
              <IndianRupee className="h-5 w-5" />
              {formatAmount(balance)}
            </h2>
          </div>

          {/* Transactions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-purple-50 p-3">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>

              <span className="text-sm font-medium text-gray-400">
                Activity
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Transactions
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {transactions.length}
            </h2>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Expenses by Category
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              See where your money is being spent
            </p>
          </div>

          {categoryData.length === 0 ? (
            <div className="flex h-72 items-center justify-center">
              <p className="text-gray-500">No expense data available</p>
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  ></Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Income vs Expense */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Income vs Expense</h2>

          <p className="mt-1 text-sm text-gray-500">
            Compare your income and expenses
          </p>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpenseData}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest financial activity
              </p>
            </div>

            <Link
              to="/transactions"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            /* Empty State */
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <CreditCard className="h-7 w-7 text-gray-400" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No transactions yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Start tracking your finances by adding your first transaction.
              </p>

              <Link
                to="/transactions/add"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </Link>
            </div>
          ) : (
            /* Transactions */
            <div className="divide-y divide-gray-100">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`rounded-xl p-3 ${
                        transaction.type === "income"
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {transaction.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <span>{transaction.category}</span>

                        <span>•</span>

                        <span>
                          {new Date(transaction.date).toLocaleDateString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    className={`whitespace-nowrap font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {formatAmount(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
