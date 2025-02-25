/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChangeProfilePasswordForm from "./changePasswordForm";
import AuthService from "../services/auth.service";
import { getToast } from "../services/toasts.service";
import userService from "../services/user.service";
import { User } from "../interfaces/auth.interfaces";


const Navbar: React.FC = () => {
  const authService: AuthService = new AuthService();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [user, setUser] = useState<User|null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };
  useEffect(()=>{
    setIsLoading(true)
    userService.user$.subscribe((user)=>{
      setUser(user);
    })
    async function getDetails():Promise<any>{
      setIsLoading(true)
      await userService.getProfileDetails();
      setIsLoading(false)
    }
    getDetails();
  },[])
  const handleProfile = () => {
    navigate("/my-profile");
  };

  const handleChangePassword = (oldPassword:string, newPassword:string)=>{
    authService.changePassword({oldPassword, newPassword}).then((response)=>{
      if(response.success){
        setShowChangePasswordForm(false);
        getToast("success", response.message)
      } else{
        getToast("error", response.message? response.message : "failed to update password")
      }
    })
  }

  return (
    <>
    <nav className="bg-blue-500 p-4 dark:bg-blue-900">
      <div className={"container mx-auto flex justify-between items-center "}>
        <div className={"text-white text-lg font-bold"}>
          <Link to="/">Employee Manager</Link>
        </div>
        <div className="flex gap-5 items-center">
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
            <Link to="/my-profile" className={"text-white hover:text-gray-300"}>
              My Profile
            </Link>
          </li>
        </ul>
        <div className="relative">
          <button
            className="flex items-center text-white focus:outline-none h-10 w-10 rounded-full overflow-hidden"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            
            {!isLoading && <img src={user?.avatar?.url ? user?.avatar?.url : `https://avatar.iran.liara.run/public/${user?.gender ==="Male" ? "boy":user?.gender==="Female"? "girl":""}?name=${user?.fullName}`  } className=" "/>}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700  rounded-md shadow-lg py-2">
              <button
              onClick={()=>{handleProfile(); setDropdownOpen(!dropdownOpen)}}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left dark:hover:bg-slate-500 dark:text-white"
              >
                My Profile
              </button>
              <button
                onClick={()=>{setShowChangePasswordForm(true);setDropdownOpen(!dropdownOpen)}}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left dark:hover:bg-slate-500 dark:text-white"
              >
                Change Password
              </button>
              <button
                onClick={()=>{handleLogout(); setDropdownOpen(!dropdownOpen)}}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left dark:hover:bg-slate-500 dark:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
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
  {showChangePasswordForm && <ChangeProfilePasswordForm onClose={()=>{setShowChangePasswordForm(false)}} onSubmit={handleChangePassword}/>}
  </>
  );
};

export default Navbar;
