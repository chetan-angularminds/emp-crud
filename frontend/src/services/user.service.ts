/* eslint-disable @typescript-eslint/no-explicit-any */
import { response } from "../interfaces/auth.interfaces";
import api from "./api.service";
import AuthService from "./auth.service";

export default class UserService{
    private authService: AuthService = new AuthService();

    async getProfileDetails(){
        return api.get<response, response>("user", {
            headers: {
              Authorization: `Bearer ${this.authService.getAccessToken()}`,
            },
          }).then((response)=>{
            return response.data
          }).catch((err)=>{
            return err.response.data
          })
    }
    async updateUserProfile(details:any){
        return api.put<response, response>("user", details,{
            headers: {
              Authorization: `Bearer ${this.authService.getAccessToken()}`,
            },
          }).then((response)=>{
            return response.data
          }).catch((err)=>{
            return err.response.data
          })
    }
    async deleteEmployee(): Promise<response> {
        return api
          .delete<response, response>(`user`, {
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
}