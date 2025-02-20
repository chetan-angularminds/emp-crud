import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const handleProfile = () => {
    navigate("/my-profile");
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className={"container mx-auto flex justify-between items-center"}>
        <div className={"text-white text-lg font-bold"}>
          <Link to="/">Employee Manager</Link>
        </div>
        <div className={"block md:hidden"}>
          <button
            className={"text-white focus:outline-none"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className={"h-6 w-6"}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <ul className={`md:flex hidden md:space-x-4`}>
          <li>
            <Link to="/" className={"text-white hover:text-gray-300"}>
              Employees
            </Link>
          </li>
          <li>
            <Link to="/organisation" className={"text-white hover:text-gray-300"}>
              Organisation
            </Link>
          </li>
          <li>
            <Link to="/auth/login" className={"text-white hover:text-gray-300"}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/auth/register" className={"text-white hover:text-gray-300"}>
              Register
            </Link>
          </li>
        </ul>
        <div className="relative">
          <button
            className="flex items-center text-white focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="/path/to/profile-logo.png"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
              <button
                onClick={handleProfile}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className={`flex flex-col gap-3 pl-9 mt-5`}>
          <li className={"border-b-amber-50"}>
            <Link to="/" className={"text-white hover:text-gray-300"}>
              Employees
            </Link>
          </li>
          <li>
            <Link to="/organisation" className={"text-white hover:text-gray-300"}>
              Organisation
            </Link>
          </li>
          <li>
            <Link to="/auth/login" className={"text-white hover:text-gray-300"}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/auth/register" className={"text-white hover:text-gray-300"}>
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
