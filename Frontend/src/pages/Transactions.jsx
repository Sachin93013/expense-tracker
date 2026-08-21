import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search);
      }

      if (type) {
        params.append("type", type);
      }

      if (category) {
        params.append("category", category);
      }

      const response = await api.get(`/transactions?${params.toString()}`);

      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);

      // Refresh transaction list
      fetchTransactions();
    } catch (error) {
      console.error("Delete transaction error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      alert(error.response?.data?.message || "Failed to delete transaction");
    }
  };

 
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, type, category]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
       <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Transactions</h2>

            <p className="mt-2 text-gray-500">
              Manage your income and expenses
            </p>
          </div>

          <Link
            to="/transactions/add"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Add Transaction
          </Link>
        </div>

        {/* Transaction Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Table Header + Filters */}
          <div className="border-b px-6 py-5">
            <h3 className="text-lg font-bold text-gray-900">
              All Transactions
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {/* Type Filter */}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              {/* Category Filter */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No transactions found.</p>

              <Link
                to="/transactions/add"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                Add your first transaction
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Title
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      {/* Title */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {transaction.title}
                        </p>

                        {transaction.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {transaction.description}
                          </p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.category}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-bold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}₹
                          {transaction.amount.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/transactions/edit/${transaction._id}`}
                          className="mr-3 text-sm font-semibold text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="text-sm font-semibold text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Transactions;
