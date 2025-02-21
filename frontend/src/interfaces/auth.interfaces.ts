/* eslint-disable @typescript-eslint/no-explicit-any */
export interface credentials {
  userName: string;
  password: string;
}

export interface registrationDetails {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  contactNumber: string;
}
export interface response {
  data: {[key: string]: any;} | null;
  success: boolean;
  message: string;
  statusCode: number;
  redirect?:string;
}
