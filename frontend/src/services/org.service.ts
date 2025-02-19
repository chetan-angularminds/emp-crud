import api from "./api.service";
import { response } from "../interfaces/auth.interfaces";
import { org } from "../interfaces/org.interfaces";
import AuthService from "./auth.service";

export default class orgService {
  private authService: AuthService = new AuthService();

  async getOrgDetails(): Promise<response> {
    return api
      .get<response, response>("org", {
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

  async updateOrgDetails(org: org): Promise<response> {
    return api
      .put<response, response>("org", org, {
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

  async createOrg(org: org): Promise<response> {
    return api
      .post<response, response>("org", org)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  async deleteOrg(): Promise<response> {
    return api
      .delete<response, response>("org", {
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
}
