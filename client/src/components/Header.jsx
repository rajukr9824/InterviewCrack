import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { removeToken } from "../utils/Auth";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    removeToken();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow px-6 py-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          InterviewCrack
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-black">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:opacity-80"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.name}&background=000&color=fff`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border"
                />

                <span className="text-gray-700 font-medium">
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm bg-black text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
