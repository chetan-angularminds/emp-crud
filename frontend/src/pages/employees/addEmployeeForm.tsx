import type React from "react";
import { useState } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { NewEmployee } from "../../interfaces/employee.interfaces";

interface AddEmployeeFormProps {
  onSubmit: (employee: NewEmployee) => void;
  onClose: () => void;
}

export default function AddEmployeeForm({
  onSubmit,
  onClose,
}: AddEmployeeFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [employee, setEmployee] = useState<NewEmployee>({
    fullName: "",
    email: "",
    contactNumber: "",
    role: "employee",
    password: "",
    confirmPassword: "",
    salary: 0,
    profileImage: null,
    gender: "",
    age: 18,
    joiningDate: "",
    department: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee.password === employee.confirmPassword) {
      console.log(employee);
      // FormData(employee) 
      onSubmit(employee);
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto dark:bg-slate-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="fullName" className="block mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={employee.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contactNumber" className="block mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={employee.contactNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={employee.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white "
                required
              >
                <option className="dark:bg-slate-400" value={""}>Select role</option>
                <option className="dark:bg-slate-400" value={"admin"}>Admin</option>
                <option className="dark:bg-slate-400" value={"employee"}>Employee</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="salary" className="block mb-1">
                Salary
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={employee.salary}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="profileImage" className="block mb-1">
                Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={(e) => setEmployee((prev) => ({ ...prev, profileImage: e.target.files?.[0] || "" }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Gender</label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={employee.gender === "Male"}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={employee.gender === "Female"}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Female
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="age" className="block mb-1">
                Age
              </label>
              <input
                type="range"
                id="age"
                name="age"
                min="18"
                max="65"
                value={employee.age}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-center">{employee.age}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="joiningDate" className="block mb-1">
                Joining Date
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={employee.joiningDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="department" className="block mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={employee.department}
                onChange={handleChange}
                list="departmentSuggestions"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <datalist id="departmentSuggestions">
                <option value="HR" />
                <option value="Engineering" />
                <option value="Marketing" />
                <option value="Sales" />
              </datalist>
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="password" className="block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={employee.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="confirmPassword" className="block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={employee.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
