/* eslint-disable @typescript-eslint/no-explicit-any */
export interface employee {
    _id: string;
    fullName: string;
    email: string;
    contactNumber: string;
    role: string;
    status: string;
    salary: number;
    [key: string]: any;
}