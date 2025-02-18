import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
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
