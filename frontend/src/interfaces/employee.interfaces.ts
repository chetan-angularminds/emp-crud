/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Employee {
  fullName: string;
  email: string;
  contactNumber: string;
  role: string;
  status: string;
  salary: number;
  [key: string]: any;
}

export interface NewEmployee {
  fullName: string;
  email: string;
  contactNumber: string;
  userName: string;
  password: string;
  confirmPassword?: string;
  role: "admin"|"employee";
  salary: number;
}
