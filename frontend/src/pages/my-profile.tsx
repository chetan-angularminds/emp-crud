/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import UserService from "../services/user.service";
import { getToast } from "../services/toasts.service";
import ConfirmationDialog from "./employees/confirmationDialogueBox";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

interface UserProfile {
  fullName: string;
  email: string;
  contactNumber: string;
  userName: string;
  role: "admin" | "employee";
  salary: number;
  [key: string]: any;
}

export default function UserProfile() {
  const userService: UserService = new UserService();
  const authService: AuthService = new AuthService();
  const Navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    fullName: "",
    email: "",
    contactNumber: "",
    userName: "",
    role: "employee",
    salary: 0,
  });

  const fetchProfile = useCallback(() => {
    userService.getProfileDetails().then((response) => {
      console.log(response);

      if (response.success) {
        const user = response.data;
        setUser({
          fullName: user.fullName,
          contactNumber: user.contactNumber,
          userName: user.userName,
          email: user.email,
          role: user.role,
          salary: user.salary,
        });
      }
    });
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, []);

  React.useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const [editedUser, setEditedUser] = useState<UserProfile>(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const details = {
      fullName: editedUser.fullName,
      contactNumber: editedUser.contactNumber,
      email: editedUser.email,
      userName: editedUser.userName,
    };
    userService.updateUserProfile(details).then((response) => {
      console.log(response);

      if (response.success) {
        setIsEditing(false);
        getToast("success", response.message);
        fetchProfile();
      } else {
        getToast("error", response.message);
      }
    });

    console.log("Updating profile:", editedUser);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Here you would typically send an API request to delete the user account
    console.log("Deleting account");
    // Add your API call here
    userService.deleteEmployee().then((response) => {
      console.log(response);

      if (response.success) {
        getToast("success", response.message);
        authService.logout();
        Navigate("/auth/login");
      } else {
        getToast("error", response.message);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">
        User Profile
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-inner">
        {!isEditing ? (
          <div className="space-y-6">
            {Object.entries(user).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center border-b border-gray-200 pb-4"
              >
                <p className="text-sm font-medium text-gray-500 w-1/3">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                <p className="text-lg text-indigo-700 font-semibold">{value}</p>
              </div>
            ))}
            <div className="pt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Update Details
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-6">
            {Object.entries(editedUser).map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key === "email" ? "email" : "text"}
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  disabled={["role", "salary"].includes(key)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
                />
              </div>
            ))}
            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={handleUpdate}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setShowDeleteConfirmation(true);
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Delete Account
        </button>
      </div>
      {showDeleteConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete your account ?"
          onCancel={() => {
            setShowDeleteConfirmation(false);
          }}
          onConfirm={() => {
            handleDeleteAccount();
            setShowDeleteConfirmation(false);
          }}
        />
      )}
    </div>
  );
}
