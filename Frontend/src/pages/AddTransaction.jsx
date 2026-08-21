import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AddTransaction() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const {
      title,
      amount,
      type,
      category,
      date,
      description,
    } = formData;

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!amount) {
      setError("Amount is required");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (!type) {
      setError("Transaction type is required");
      return;
    }

    if (!category) {
      setError("Category is required");
      return;
    }

    if (!date) {
      setError("Date is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/transactions", {
        title,
        amount: Number(amount),
        type,
        category,
        date,
        description,
      });

      navigate("/transactions");
    } catch (error) {
      console.error("Add transaction error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to add transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-2xl px-6 py-10">

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Add Transaction
            </h2>

            <p className="mt-2 text-gray-500">
              Add a new income or expense
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows="4"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">

              <Link
                to="/transactions"
                className="w-1/2 rounded-lg border border-gray-300 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-1/2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? "Adding..."
                  : "Add Transaction"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default AddTransaction;