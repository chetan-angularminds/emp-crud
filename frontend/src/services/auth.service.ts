import api from "./api.service.ts";
import {
  credentials,
  registrationDetails,
  response,
} from "../interfaces/auth.interfaces";

export default class AuthService {
  async login(credentials: credentials): Promise<response> {
    return api
      .post("auth/login", credentials)
      .then((response) => {
        if (response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);
        }
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  logout() {
    localStorage.removeItem("token");
  }
  isAuthenticated() {
    return localStorage.getItem("token") !== null;
  }
  getAccessToken() {
    const token: string | null = localStorage.getItem("token");
    return token;
  }

  async register(user: registrationDetails): Promise<response> {
    return api
      .post<response, response>("auth/register", user)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<response> {
    return api
      .put<response, response>("auth/change-password", data, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
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
}
