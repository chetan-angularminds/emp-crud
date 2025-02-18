import React, { useState } from "react";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";

const employeesData = {
  statusCode: 200,
  data: {
    employees: [
      {
        _id: "67b31340fda89888cd3435ac",
        fullName: "chetan mohite",
        email: "chetan@ngm.com",
        contactNumber: "9764560354",
        userName: "chetan@ngm",
        role: "admin",
        status: "active",
        deleted: false,
        createdAt: "2025-02-17T10:45:20.740Z",
        updatedAt: "2025-02-17T11:44:16.859Z",
        createdBy: "67b31340fda89888cd3435ac",
        __v: 0,
        org: "67b32110de308387d0beeb79",
      },
      {
        _id: "67b322a124ea2d3c8c0123e7",
        fullName: "pushpak bhoite",
        email: "pushpak@ngm.com",
        contactNumber: "1234567890",
        userName: "pushpak@bhoite",
        role: "employee",
        status: "active",
        org: "67b32110de308387d0beeb79",
        deleted: false,
        createdBy: "67b31340fda89888cd3435ac",
        createdAt: "2025-02-17T11:50:57.848Z",
        updatedAt: "2025-02-17T11:58:46.565Z",
        __v: 0,
      },
      {
        _id: "67b4109ba4ce26ab8c4089cb",
        fullName: "Bhavesh Choudhary",
        email: "bhavesh@ngm.com",
        contactNumber: "8523697412",
        userName: "bhavesh@ngm",
        role: "employee",
        status: "active",
        org: "67b32110de308387d0beeb79",
        deleted: false,
        createdBy: "67b31340fda89888cd3435ac",
        createdAt: "2025-02-18T04:46:19.561Z",
        updatedAt: "2025-02-18T04:46:19.561Z",
        __v: 0,
      },
    ],
    totalPages: 1,
    currentPage: 1,
  },
  message: "success",
  success: true,
};

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [employees, setEmployees] = useState(employeesData.data.employees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    const order =
      sortBy === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(field);
    setSortOrder(order);
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((employee) => employee._id !== id));
  };

  const handleAddOrUpdate = (employee: any) => {
    if (modalType === "add") {
      setEmployees([...employees, { ...employee, _id: Date.now().toString() }]);
    } else {
      setEmployees(
        employees.map((emp) => (emp._id === employee._id ? employee : emp))
      );
    }
    setIsModalOpen(false);
  };

  const openModal = (type: "add" | "edit", employee: any = null) => {
    setModalType(type);
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const filteredEmployees = employees
    .filter((employee) =>
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy].localeCompare(a[sortBy]);
      }
    });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={() => openModal("add")}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add Employee
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th
              className={`py-2 px-4 border-b cursor-pointer ${sortBy === "fullName" ? "flex gap-2 justify-center align-middle":""}`}
              onClick={() => handleSort("fullName")}
            >
              Name {sortBy === "fullName" ? sortOrder === "asc" ? <AiOutlineSortAscending className="my-auto"/>: <AiOutlineSortDescending/> : ""}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer "
              onClick={() => handleSort("email")}
            >
              Email  {sortBy === "email" ? sortOrder === "asc" ? <AiOutlineSortAscending className="my-auto"/>: <AiOutlineSortDescending/> : ""}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer "
              onClick={() => handleSort("contactNumber")}
            >
              Contact Number {sortBy === "contactNumber" ? sortOrder === "asc" ? <AiOutlineSortAscending className="my-auto"/>: <AiOutlineSortDescending/> : ""}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer "
              onClick={() => handleSort("role")}
            >
              Role  {sortBy === "role" ? sortOrder === "asc" ? <AiOutlineSortAscending className="my-auto"/>: <AiOutlineSortDescending/> : ""}
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer "
              onClick={() => handleSort("status")}
            >
              Status  {sortBy === "status" ? sortOrder === "asc" ? <AiOutlineSortAscending className="my-auto"/>: <AiOutlineSortDescending/> : ""}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td className="py-2 px-4 border-b">{employee.fullName}</td>
              <td className="py-2 px-4 border-b">{employee.email}</td>
              <td className="py-2 px-4 border-b">{employee.contactNumber}</td>
              <td className="py-2 px-4 border-b">{employee.role}</td>
              <td className="py-2 px-4 border-b">{employee.status}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => openModal("edit", employee)}
                  className="mr-2 p-2 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="  fixed inset-0 flex items-center justify-center bg-black backdrop-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg ">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add Employee" : "Edit Employee"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const employee = Object.fromEntries(formData.entries());
                handleAddOrUpdate(employee);
              }}
            >
              <input
                type="text"
                name="fullName"
                defaultValue={currentEmployee?.fullName || ""}
                placeholder="Full Name"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
              />
              <input
                type="email"
                name="email"
                defaultValue={currentEmployee?.email || ""}
                placeholder="Email"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
              />
              <input
                type="text"
                name="contactNumber"
                defaultValue={currentEmployee?.contactNumber || ""}
                placeholder="Contact Number"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
              />
              <input
                type="text"
                name="role"
                defaultValue={currentEmployee?.role || ""}
                placeholder="Role"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
              />
              <input
                type="text"
                name="status"
                defaultValue={currentEmployee?.status || ""}
                placeholder="Status"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                required
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded w-full"
              >
                {modalType === "add" ? "Add Employee" : "Update Employee"}
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 p-2 bg-gray-500 text-white rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
