import React, { useState } from "react";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { getToast } from "../services/toasts.service";

function Register() {
  const authService: AuthService = new AuthService();
  const Navigate = useNavigate();
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
  };

  return (
    <div className="my-20">
      <div className=" flex justify-center items-center h-screen bg-gray-100">
        <form
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">userName</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
              }}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => {
                handleChange(e);
                handleConfirmPasswordChange(e);
              }}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
