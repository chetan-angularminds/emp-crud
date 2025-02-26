/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import EmployeeService from "../../services/employee.service";
import { useParams } from "react-router-dom";

const EmployeeDetails: React.FC = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState<any>(null);
    const employeeService: EmployeeService = new EmployeeService();

    useEffect(() => {
        console.log(id);
        
        if (id) {
            employeeService
                .getEmployee(id)
                .then((response) => setEmployee(response.data))
                .catch((error) =>
                    console.error("Error fetching employee details:", error)
                );
        }
    }, []);

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto dark:bg-gray-800 dark:text-white">
            {/* Profile Image Section */}
            <div className="md:col-span-1 bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                <img
                    src={employee?.avatar?.url ||`https://avatar.iran.liara.run/public/${
                  employee?.gender === "Male"
                    ? "boy"
                    : employee?.gender === "Female"
                    ? "girl"
                    : ""
                }?name=${employee?.fullName}`}
                    alt={employee.fullName}
                    className="w-full h-auto rounded-lg object-cover"
                />
            </div>

            {/* Personal Details Section */}
            <div className="md:col-span-2 bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    {/* Personal Info */}
                    <div className="flex-1  rounded-lg  p-4">
                        <h2 className="text-2xl font-bold mb-4">{employee?.fullName}</h2>
                        <div className="space-y-2">
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Email:</span>
                                {employee?.email}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Contact:</span>
                                {employee?.contactNumber}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Age:</span>
                                {employee?.age}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Gender:</span>
                                {employee?.gender}
                            </p>
                        </div>
                    </div>

                    {/* Organization Info */}
                    <div className="flex-1 rounded-lg  p-4">
                        <h3 className="text-xl font-bold mb-2">Organization</h3>
                        <div className="space-y-2">
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Name:</span>
                                {employee?.org?.name}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Address:</span>
                                {employee?.org?.address}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Phone:</span>
                                {employee?.org?.phone}
                            </p>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 rounded-lg  p-4">
                        <h3 className="text-xl font-bold mb-2">Job Details</h3>
                        <div className="space-y-2">
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Role:</span>
                                {employee?.role}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Status:</span>
                                {employee?.status}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Department:</span>
                                {employee?.department}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Joining Date:</span>
                                {new Date(employee?.joiningDate)?.toLocaleDateString()}
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold mr-2">Salary:</span>
                                ${employee?.salary?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;