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
  const Navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [jumpToPage, setJumpToPage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const authService: AuthService = new AuthService();

  const fetchEmployees = useCallback(() => {
    setIsLoading(true);
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

        if (response.redirect) Navigate(response.redirect);
      }
      setIsLoading(false);
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
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if(key ==="profileImage"){
        formData.append("avatar", value as string);
      } else {
        formData.append(key, value as string);
      }
      
    });
    employeeService.createEmployee(formData).then((response) => {
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

  const renderLoadingIcon = () => {
    return (
      <svg
        aria-hidden="true"
        className="w-3 h-3 text-gray-200 inline animate-spin dark:text-gray-600 fill-blue-600  dark:fill-gray-300"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    );
  };

  return (
    <div
      className="container mx-auto px-4 py-8 text-sm dark:text-white"
      onClick={() => {
        if (showOptions) setShowOptions(false);
      }}
    >
      <h1 className="text-3xl font-bold mb-6 ">Employee List</h1>
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
              className="px-4 py-2 bg-teal-400 text-white font-bold shadow-md rounded-md hover:bg-teal-500 dark:bg-purple-700 dark:hover:bg-purple-500" 
              onClick={() => setShowAddForm(true)}
            >
              Add Employee
            </button>
          )}
          <div className="flex items-center">
            <span className="mr-2">Show:</span>
            <select
              className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5} className="dark:bg-slate-400">5</option>
              <option value={10} className="dark:bg-slate-400">10</option>
              <option value={20} className="dark:bg-slate-400">20</option>
              <option value={50} className="dark:bg-slate-400">50</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto max-h-full min-h-70">
        <div className="inline-block min-w-full min-h-fit">
          <table className=" w-full border-collapse min-h-fit ">
            <thead>
              <tr className="bg-gray-200 dark:bg-slate-600 py-4">
                <th
                  className="p-2 text-left cursor-pointer text-nowrap "
                  onClick={() => handleSort("fullName")}
                >
                  Full Name {renderSortIcon("fullName")}&nbsp;{isLoading&& sortConfig.key ==="fullName" && renderLoadingIcon()}
                </th>
                <th
                  className="p-2 text-left cursor-pointer text-nowrap"
                  onClick={() => handleSort("email")}
                >
                  Email {renderSortIcon("email")}&nbsp;{isLoading&& sortConfig.key ==="email" && renderLoadingIcon()}
                </th>
                <th
                  className="p-2 text-left cursor-pointer text-nowrap"
                  onClick={() => handleSort("contactNumber")}
                >
                  Contact Number {renderSortIcon("contactNumber")}&nbsp;{isLoading&& sortConfig.key ==="contactNumber" && renderLoadingIcon()}
                </th>
                <th
                  className="p-2 text-left cursor-pointer text-nowrap"
                  onClick={() => handleSort("role")}
                >
                  Role {renderSortIcon("role")}&nbsp;{isLoading&& sortConfig.key ==="role" && renderLoadingIcon()}
                </th>
                <th
                  className="p-2 text-left cursor-pointer text-nowrap"
                  onClick={() => handleSort("status")}
                >
                  Status {renderSortIcon("status")}&nbsp;{isLoading&& sortConfig.key ==="status" && renderLoadingIcon()}
                </th>
                {isAdmin && (
                  <th
                    className="p-2 text-left cursor-pointer text-nowrap"
                    onClick={() => handleSort("salary")}
                  >
                    Salary {renderSortIcon("salary")}&nbsp;{isLoading&& sortConfig.key ==="salary" && renderLoadingIcon()}
                  </th>
                )}
                {isAdmin && <th className="p-2 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, i) => (
                <tr key={employee._id} className="border-b py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700">
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
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
                              className="absolute z-990 right-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-slate-700"
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
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-500 dark:text-white"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowUpdateForm(true);
                                    setShowOptions(false);
                                  }}
                                >
                                  Update Details
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-500 dark:text-white"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowChangePasswordForm(true);
                                    setShowOptions(false);
                                  }}
                                >
                                  Change Password
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-500 dark:text-white"
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
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <button
            className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft className="inline mr-1" /> Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600"
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
