/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
} from "react-icons/fa";
import EmployeeService from "../../services/employee.service";
import AddEmployeeForm from "./addEmployeeForm";
import UpdateEmployeeForm from "./updateEmployeeForm";
import ChangePasswordForm from "./changePasswordForm";
import ConfirmationDialog from "./confirmationDialogueBox";
import { Employee, NewEmployee } from "../../interfaces/employee.interfaces";
import { getToast } from "../../services/toasts.service";
import AuthService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

interface SortConfig {
  key: keyof Employee;
  direction: "asc" | "desc";
}

export default function EmployeeList() {
  const employeeService = new EmployeeService();
  const Navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "fullName",
    direction: "asc",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [jumpToPage, setJumpToPage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const authService: AuthService = new AuthService();

  const fetchEmployees = useCallback(() => {
    const queryParams = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      sortBy: sortConfig.key,
      order: sortConfig.direction,
    };

    employeeService.getEmployees(queryParams).then((response) => {
      if (response.success) {
        setEmployees(response?.data?.employees);
        setTotalPages(response?.data?.totalPages);
      } else {
        getToast("error", response.message);
        console.log(response);
        
        if(response.redirect) Navigate(response.redirect)
      }
    });
  }, [currentPage, itemsPerPage, searchTerm, sortConfig]);

  useEffect(() => {
    fetchEmployees();
    authService.isAdmin().then((response) => {
      console.log(response);

      setIsAdmin(response);
    });
  }, [fetchEmployees]);

  const handleSort = (key: keyof Employee) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const renderSortIcon = (key: keyof Employee) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <FaSortUp className="inline ml-1" />
      ) : (
        <FaSortDown className="inline ml-1" />
      );
    }
    return <FaSort className="inline ml-1" />;
  };

  const handleAddEmployee = (newEmployee: NewEmployee) => {
    const { confirmPassword, ...data } = newEmployee;
    employeeService.createEmployee(data).then((response) => {
      if (response.success) {
        fetchEmployees();
        setShowAddForm(false);
        getToast("success", response.message);
      } else {
        getToast("error", response.message);
      }
    });
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    employeeService
      .updateEmployee(updatedEmployee, selectedEmployee?._id)
      .then((response) => {
        if (response.success) {
          fetchEmployees();
          setShowUpdateForm(false);
          getToast("success", response.message);
        } else {
          getToast("error", response.message);
        }
      });
  };

  const handleChangePassword = (employeeId: string, newPassword: string) => {
    employeeService.changePassword(employeeId, newPassword).then((response) => {
      if (response.success) {
        setShowChangePasswordForm(false);
        getToast("success", response.message);
      } else {
        getToast("error", response.message);
      }
    });
  };

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      employeeService.deleteEmployee(selectedEmployee._id).then((response) => {
        console.log(response);

        if (response.success) {
          fetchEmployees();
          setShowDeleteConfirmation(false);
          getToast("success", response.message);
        } else {
          getToast("error", response.message);
        }
      });
    } else {
      getToast("error", "employee not selected");
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = Number.parseInt(jumpToPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    setJumpToPage("");
  };

  return (
    <div
      className="container mx-auto px-4 py-8 text-sm"
      onClick={() => {
        if (showOptions) setShowOptions(false);
      }}
    >
      <h1 className="text-3xl font-bold mb-6">Employee List</h1>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <button
              className="px-4 py-2 bg-teal-400 text-white font-bold shadow-md rounded-md hover:bg-teal-500"
              onClick={() => setShowAddForm(true)}
            >
              Add Employee
            </button>
          )}
          <div className="flex items-center">
            <span className="mr-2">Show:</span>
            <select
              className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
      <div className=" overflow-x-auto">
        <table className=" w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                Full Name {renderSortIcon("fullName")}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {renderSortIcon("email")}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => handleSort("contactNumber")}
              >
                Contact Number {renderSortIcon("contactNumber")}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role {renderSortIcon("role")}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status {renderSortIcon("status")}
              </th>
              {isAdmin && (
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort("salary")}
                >
                  Salary {renderSortIcon("salary")}
                </th>
              )}
              {isAdmin && <th className="p-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, i) => (
              <tr key={employee._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{employee.fullName}</td>
                <td className="p-2">{employee.email}</td>
                <td className="p-2">{employee.contactNumber}</td>
                <td className="p-2">{employee.role}</td>
                <td className="p-2">{employee.status}</td>
                {isAdmin && <td className="p-2">&#8377;{employee.salary}</td>}
                {isAdmin && (
                  <td className="p-2">
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setShowUpdateForm(false);
                          setShowChangePasswordForm(false);
                          setShowDeleteConfirmation(false);
                          if (selectedEmployee == employee) {
                            setShowOptions(!showOptions);
                          } else setShowOptions(true);
                          setSelectedEmployee(employee);
                        }}
                      >
                        <FaEllipsisV />
                      </button>
                      {showOptions &&
                        selectedEmployee?._id === employee._id && (
                          <div
                            className="absolute z-990 right-0 mt-2 w-48 bg-white rounded-md shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                            style={
                              i > 1
                                ? {
                                    bottom: "100%",
                                    transform: "translateY(-10%)",
                                  }
                                : {}
                            }
                          >
                            <div className="py-1">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setShowUpdateForm(true);
                                  setShowOptions(false);
                                }}
                              >
                                Update Details
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setShowChangePasswordForm(true);
                                  setShowOptions(false);
                                }}
                              >
                                Change Password
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setShowDeleteConfirmation(true);
                                  setShowOptions(false);
                                }}
                              >
                                Delete Employee
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <button
            className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft className="inline mr-1" /> Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight className="inline ml-1" />
          </button>
        </div>
        <form
          onSubmit={handleJumpToPage}
          className="flex items-center space-x-2 p-0"
        >
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            className="w-30 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Page"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-md bg-blue-500 text-white text-sm font-bold"
          >
            Go
          </button>
        </form>
      </div>

      {showAddForm && (
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {showUpdateForm && selectedEmployee && (
        <UpdateEmployeeForm
          employee={selectedEmployee}
          onSubmit={handleUpdateEmployee}
          onClose={() => {
            setShowUpdateForm(false);
            setShowOptions(false);
          }}
        />
      )}

      {showChangePasswordForm && selectedEmployee && (
        <ChangePasswordForm
          employeeId={selectedEmployee._id}
          onSubmit={handleChangePassword}
          onClose={() => {
            setShowChangePasswordForm(false);
            setShowOptions(false);
          }}
        />
      )}

      {showDeleteConfirmation && selectedEmployee && (
        <ConfirmationDialog
          message={`Are you sure you want to delete ${selectedEmployee.fullName}?`}
          onConfirm={handleDeleteEmployee}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setShowOptions(false);
          }}
        />
      )}
    </div>
  );
}
