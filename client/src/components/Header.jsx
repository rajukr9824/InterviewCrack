import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { removeToken } from "../utils/Auth";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          InterviewCrack
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-black">
            Home
          </Link>
          <Link to="/learn" className="text-gray-700 hover:text-black">
            Learn
          </Link>
          <Link to="/interview" className="text-gray-700 hover:text-black">
            Practice
          </Link>
          <Link to="/quiz" className="text-gray-700 hover:text-black">
            Quiz
          </Link>
          <Link to="/coding" className="text-gray-700 hover:text-black">
            Coding
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-black">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">
          <Link onClick={() => setOpen(false)} to="/" className="block">
            Home
          </Link>
          <Link onClick={() => setOpen(false)} to="/learn" className="block">
            Learn
          </Link>
          <Link onClick={() => setOpen(false)} to="/interview" className="block">
            Practice
          </Link>
          <Link onClick={() => setOpen(false)} to="/quiz" className="block">
            Quiz
          </Link>
          <Link
            onClick={() => setOpen(false)}
            to="/coding"
            className="block"
          >
            Coding
          </Link>
          <Link onClick={() => setOpen(false)} to="/profile" className="block">
            Profile
          </Link>

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="w-full bg-black text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
