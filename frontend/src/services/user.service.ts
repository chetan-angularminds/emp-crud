/* eslint-disable @typescript-eslint/no-explicit-any */
import { response, User } from "../interfaces/auth.interfaces";
import api from "./api.service";
import AuthService from "./auth.service";
import { BehaviorSubject } from 'rxjs';
import { getToast } from "./toasts.service";

class UserService{
    private authService: AuthService = new AuthService();
    private userSubject: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
    constructor(){
      // this.getProfileDetails();
    }
    get user$() {
      return this.userSubject.asObservable();
    }

    setUserDetails(details: any) {
      this.userSubject.next(details);
    }


    async getProfileDetails(){
        return api.get<response, response>("user", {
            headers: {
              Authorization: `Bearer ${this.authService.getAccessToken()}`,
            },
          }).then((response)=>{
            const userDetails = response?.data?.data
            console.log(userDetails);
            
            this.setUserDetails(userDetails)
            return response.data
          }).catch((err)=>{
            getToast("error",  err.response.data.message);
            return err.response.data
          })
    }
    async deleteProfilePicture(){
      return api.delete<response, response>("user/profile-picture",{
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      }).then((response)=>{
        return response.data
      }).catch((err)=>{
        return err.response.data
      })
    }
    async updateUserProfilePicture(details:any){
      return api.put<response, response>("user/profile-picture", details,{
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
    async deleteAccount(): Promise<response> {
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
const userService = new UserService();
export default userService;
