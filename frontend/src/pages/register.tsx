import React, { useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { getToast } from "../services/toasts.service";

function Register() {
  const authService: AuthService = new AuthService();
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    userName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] =
    useState(false);

  React.useEffect(() => {
    if (isConfirmPasswordTouched) {
      if (formData.password !== formData.confirmPassword) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "",
        }));
      }
    }
  }, [formData.password, formData.confirmPassword, isConfirmPasswordTouched]);

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsConfirmPasswordTouched(true);
    handleChange(e);
  };
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
      valid = false;
    } else {
      newErrors.fullName = "";
    }

    if (!formData.userName) {
      newErrors.userName = "userName is required";
      valid = false;
    } else {
      newErrors.userName = "";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    } else {
      newErrors.email = "";
    }

    const contactNumberRegex = /^[0-9]{10}$/;
    if (
      !formData.contactNumber ||
      !contactNumberRegex.test(formData.contactNumber)
    ) {
      newErrors.contactNumber = "Valid contact number is required";
      valid = false;
    } else {
      newErrors.contactNumber = "";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else {
      newErrors.password = "";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true)
      console.log("Form submitted", formData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userDetails } = formData;

      const response = await authService.register(userDetails);

      if (response.success) {
        console.log("User registered successfully");
        getToast("success", "User registered successfully!");
        Navigate("/auth/login");
      } else {
        console.log("Error registering user", response);
        getToast("error", response.message);
      }
    }
    setIsLoading(false)
  };

  return (
    <div className=" h-full">
      <div className=" flex justify-center items-center h-fit bg-gray-100  py-6 dark:bg-slate-800">
        <form
          className="bg-white p-8 rounded shadow-md w-full max-w-md dark:bg-slate-600"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Register</h2>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 dark:text-gray-300"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">userName</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 dark:text-gray-300"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 dark:text-gray-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 dark:text-gray-300"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
              }}
              className="w-full p-2 border border-gray-300 rounded mt-1 dark:text-gray-300"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => {
                handleChange(e);
                handleConfirmPasswordChange(e);
              }}
              className="w-full p-2 border border-gray-300 rounded mt-1 dark:text-gray-300"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <p className="text-center dark:text-white">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer "
              onClick={() => {
                Navigate("/auth/login");
              }}
            >
              Login Here
            </span>
          </p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            Register &nbsp; {isLoading && <svg
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
        </form>
      </div>
    </div>
  );
}

export default Register;
