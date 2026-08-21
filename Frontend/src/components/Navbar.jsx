import { Link, useNavigate } from "react-router-dom";
import { LogOut, Wallet } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-600 p-2">
            <Wallet className="h-5 w-5 text-white" />
          </div>

          <span className="text-lg font-bold text-gray-900">
            Expense Tracker
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">

          <Link
            to="/dashboard"
            className="hidden font-medium text-blue-600 sm:block"
          >
            Dashboard
          </Link>

          <Link
            to="/transactions"
            className="font-medium text-gray-600 hover:text-blue-600"
          >
            Transactions
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />

            <span className="hidden sm:block">
              Logout
            </span>
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;