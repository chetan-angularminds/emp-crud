/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import userService from "../services/user.service";
import { getToast } from "../services/toasts.service";
import ConfirmationDialog from "./employees/confirmationDialogueBox";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { User } from "../interfaces/auth.interfaces";
import { FaCamera } from "react-icons/fa";

interface UserProfile {
  fullName: string;
  email: string;
  contactNumber: string;
  role: string;
  profilePicture: string;
  [key: string]: any;
}

export default function UserProfile() {
  const authService: AuthService = new AuthService();
  const Navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] =
    useState<any>(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File>();
  const [user, setUser] = useState<UserProfile>({
    fullName: "",
    email: "",
    contactNumber: "",
    role: "employee",
    profilePicture: "",
    gender: "",
  });

  const fetchProfile = useCallback(async () => {
    userService.getProfileDetails().then((response) => {
      console.log(response);
    });
  }, []);

  React.useEffect(() => {
    const subscription = userService.user$.subscribe((user: User | null) => {
      if (user) {
        setUser({
          fullName: user.fullName,
          contactNumber: user.contactNumber,
          email: user.email,
          role: user.role,
          profilePicture: user?.avatar?.url,
          gender: user?.gender,
        });
      }
    });
    fetchProfile();
    return () => subscription.unsubscribe();
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
    setIsLoading(true)
    const details = {
      fullName: editedUser.fullName,
      contactNumber: editedUser.contactNumber,
      email: editedUser.email,
      gender: editedUser.gender
    };
    userService.updateUserProfile(details).then((response) => {
      console.log(response);
      console.log(details);
      
      if (response.success) {
        setIsEditing(false);
        getToast("success", response.message);
        fetchProfile();
      } else {
        getToast("error", response.message);
      }
      setIsLoading(false)
    });

    console.log("Updating profile:", editedUser);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    setIsLoading(true)
    console.log("Deleting account");
    userService.deleteAccount().then((response) => {
      console.log(response);

      if (response.success) {
        getToast("success", response.message);
        authService.logout();
        Navigate("/auth/login");
      } else {
        getToast("error", response.message);
      }
      setIsLoading(false)
    });
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser((prevUser: any) => ({
          ...prevUser,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpdate = () => {
    setIsLoading(true)
    const details = new FormData();
    if (!newProfilePicture) {
      return;
    }
    details.append("avatar", newProfilePicture);
    userService.updateUserProfilePicture(details).then((response) => {
      console.log(response);

      if (response.success) {
        setShowProfilePictureModal(false);
        getToast("success", response.message);
        fetchProfile();
      } else {
        getToast("error", response.message);
      }
      setIsLoading(false)
    });
  };

  const handleDeleteProfilePicture = async () => {
    setIsLoading(true)
    userService.deleteProfilePicture().then((response) => {
      console.log(response);

      if (response.success) {
        setShowProfilePictureModal(false);
        getToast("success", response.message);
         fetchProfile();
      } else {
        getToast("error", response.message);
      }
      setIsLoading(false)
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-indigo-100 shadow-2xl rounded-xl dark:bg-slate-400">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">
        User Profile
      </h2>
      <div className="bg-white dark:bg-slate-300 p-6 rounded-lg shadow-inner">
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <img
              src={
                user.profilePicture ||
                `https://avatar.iran.liara.run/public/${
                  user?.gender === "Male"
                    ? "boy"
                    : user?.gender === "Female"
                    ? "girl"
                    : ""
                }?name=${user?.fullName}`
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <button
              onClick={() => setShowProfilePictureModal(true)}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full"
            >
              <FaCamera />
            </button>
          </div>
        </div>
        {!isEditing ? (
          <div className="space-y-6">
            {Object.entries(user).map(
              ([key, value]) =>
                key !== "profilePicture" &&
                key !== "salary" && (
                  <div
                    key={key}
                    className="flex items-center border-b border-gray-200 pb-4"
                  >
                    <p className="text-sm font-medium text-gray-500 w-1/3">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </p>
                    <p className="text-lg text-indigo-700 font-semibold">
                      {value}
                    </p>
                  </div>
                )
            )}
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
            {Object.entries(editedUser).map(
              ([key, value]) =>
                key !== "profilePicture" &&
                key !== "salary" && (
                  (key!== "gender" && <div key={key}>
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
                      disabled={["role"].includes(key)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
                    />
                  </div>)||
                  (key==="gender" && <div className="mb-4">
                    <label className="block mb-1">Gender</label>
                    <div className="flex items-center">
                      <label className="mr-4">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={value === "Male"}
                          onChange={handleInputChange}
                          className="mr-1"
                        />
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={value === "Female"}
                          onChange={handleInputChange}
                          className="mr-1"
                        />
                        Female
                      </label>
                    </div>
                  </div>)
                )
            )}
            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={handleUpdate}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Save Changes &nbsp;{isLoading && <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg dark:bg-gray-400 dark:hover:bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
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
          Delete Account &nbsp;{isLoading && <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>}
        </button>
      </div>
      {showDeleteConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete your account?"
          onCancel={() => {
            setShowDeleteConfirmation(false);
          }}
          onConfirm={() => {
            handleDeleteAccount();
            setShowDeleteConfirmation(false);
          }}
        />
      )}
      {showProfilePictureModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowProfilePictureModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Update Profile Picture
            </h3>
            <div className="flex flex-col justify-center items-center mb-4">
              <img
                src={
                  editedUser.profilePicture || `https://avatar.iran.liara.run/public/${
                  user?.gender === "Male"
                    ? "boy"
                    : user?.gender === "Female"
                    ? "girl"
                    : ""
                }?name=${user?.fullName}`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              {!user.profilePicture && <p className="text-black">You don't have any profile picture</p>}
            </div>
            {showProfilePictureModal === "change" ? (
              <div className="mt-4">
                <label htmlFor="profilePicture" className="cursor-pointer">
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out cursor-pointer">
                    Choose File
                  </span>
                </label>
                <button
                  onClick={handleProfilePictureUpdate}
                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  Upload &nbsp;{isLoading && <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>}
                </button>
              </div>
            ) : (
              <div className="flex justify-between">
                <button
                  onClick={() => setShowProfilePictureModal("change")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  Change
                </button>
                <button
                  onClick={() => setShowProfilePictureModal("delete")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  Delete &nbsp;{isLoading && <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>}
                </button>
              </div>
            )}
            {showProfilePictureModal === "delete" && (
              <ConfirmationDialog
                message="Are you sure you want to delete your profile picture?"
                onCancel={() => setShowProfilePictureModal(false)}
                onConfirm={() => {
                  handleDeleteProfilePicture();
                  setShowProfilePictureModal("true");
                }}
              />
            )}
          </div>
        </div>
      )}
      {showProfilePictureModal === "delete" && (
        <ConfirmationDialog
          message="Are you sure you want to delete your profile picture?"
          onCancel={() => setShowProfilePictureModal(true)}
          onConfirm={() => {
            handleDeleteProfilePicture();
            setShowProfilePictureModal(true)
          }}
        />
      )}
    </div>
  );
}
