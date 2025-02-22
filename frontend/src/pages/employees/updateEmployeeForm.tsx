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
      <div className="bg-white dark:bg-slate-700 p-6 rounded-lg w-full max-w-md h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Employee</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="userName" className="block mb-1">
              User Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={updatedEmployee.userName}
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
                <option value={""}>select role</option>
                <option value={"admin"}>admin</option>
                <option value={"employee"}>employee</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={updatedEmployee.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
                <option value={"active"}>active</option>
                <option value={"inactive"}>inactive</option>
            </select>
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
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

