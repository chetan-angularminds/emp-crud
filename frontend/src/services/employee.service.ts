/* eslint-disable @typescript-eslint/no-explicit-any */
import { response } from "../interfaces/auth.interfaces";
import { Employee } from "../interfaces/employee.interfaces";
import api from "./api.service";
import AuthService from "./auth.service";

export default class EmployeeService {
  private authService: AuthService = new AuthService();

  async getEmployees(params: object): Promise<response> {
    return api
      .get<response, response>("employees", {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
        params,
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
  async getEmployee(id: string): Promise<response> {
    return api
      .get<response, response>(`employees/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
  async createEmployee(employee: any): Promise<response> {
    return api
      .post<response, response>("employees", employee, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
  async updateEmployee(employee: Employee, id: string): Promise<response> {
    return api
      .put<response, response>(`employees/employee/${id}`, employee, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
  async deleteEmployee(id: string): Promise<response> {
    return api
      .delete<response, response>(`employees/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .then((response) => {
        console.log(response);
        
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  async changePassword(id: string, newPassword: string){
    return api.post<response, response>(`employees/employee/${id}`,{newPassword},{
      headers: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    }).then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
  }
}
