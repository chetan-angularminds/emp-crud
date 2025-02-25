import type React from "react"
import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { Employee } from "../../interfaces/employee.interfaces"

interface UpdateEmployeeFormProps {
  employee: Employee
  onSubmit: (employee: Employee) => void
  onClose: () => void
}

export default function UpdateEmployeeForm({ employee, onSubmit, onClose }: UpdateEmployeeFormProps) {
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee>(employee)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setUpdatedEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(updatedEmployee)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-700 p-6 rounded-lg w-full max-w-4xl h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Employee</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="fullName" className="block mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={updatedEmployee.fullName}
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
              value={updatedEmployee.email}
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
              value={updatedEmployee.contactNumber}
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
              value={updatedEmployee.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={""} className="dark:bg-slate-400">select role</option>
              <option value={"admin"} className="dark:bg-slate-400">admin</option>
              <option value={"employee"} className="dark:bg-slate-400">employee</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block mb-1">
              Status
            </label>
            <div>
            <input
              type="checkbox"
              id="status"
              name="status-active"
              checked={updatedEmployee.status === "active"}
              onChange={(e) => handleChange({ target: { name: "status", value: e.target.checked ? "active" : "inactive" } } as React.ChangeEvent<HTMLInputElement>)}
              className="mr-2"
            />
            <span>Active</span>
            </div>
            <div>
            <input
              type="checkbox"
              id="status"
              name="status-inactive"
              checked={updatedEmployee.status === "inactive"}
              onChange={(e) => handleChange({ target: { name: "status", value: e.target.checked ? "inactive" : "active" } } as React.ChangeEvent<HTMLInputElement>)}
              className="mr-2"
            />
            <span>Inactive</span>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="salary" className="block mb-1">
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={updatedEmployee.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
              value={updatedEmployee.age}
              onChange={handleChange}
              className="w-full"
              required
            />
            <span>{updatedEmployee.age}</span>
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Gender
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                value="Male"
                checked={updatedEmployee.gender === "Male"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="male" className="mr-4">Male</label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="Female"
                checked={updatedEmployee.gender === "Female"}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
            <div className="mb-4">
            <label htmlFor="joiningDate" className="block mb-1">
              Joining Date
            </label>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              value={updatedEmployee.joiningDate ? new Date(updatedEmployee.joiningDate).toISOString().split('T')[0] : ''}
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
              value={updatedEmployee.department}
              onChange={handleChange}
              list="department-suggestions"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <datalist id="department-suggestions">
              <option value="HR" />
              <option value="Engineering" />
              <option value="Marketing" />
              <option value="Sales" />
              <option value="Admin" />
              <option value="IT" />
            </datalist>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
