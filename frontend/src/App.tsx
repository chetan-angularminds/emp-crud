/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from './pages/register';
import Login from './pages/login';
import OrganisationDetails from './pages/organisation';
import Employees from './pages/employees/employees';
import { Navigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import { getToast } from "./services/toasts.service";
import UserProfile from "./pages/my-profile";
import AuthService from "./services/auth.service";
import EmployeeDetails from "./pages/employees/employeeDetails";
import themeService from "./services/theme.service";
function App() {
  const location = useLocation();
 const authService = new AuthService();
  const isAuthenticated = () => {
    // Add your authentication logic here
    return localStorage.getItem("token") !== null;
  };

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [result, setResult] = useState(authService.getAccessToken()? true: false);
    useEffect(()=>{
      if (result){
        authService.isAuthenticated().then((response)=>{
          
            setResult(response) 
          
        }).catch((_err)=>{
          setResult(false)
          getToast("error", _err.message)
        })
      }
    },[])
    if (!result) {
      authService.logout()
    }
    return result ? children : <Navigate to="/auth/login" />;
  };
  const CanAccess = ({ children }: { children: JSX.Element }) => {
    if(isAuthenticated()) getToast("error", "user is already logged in")
    return !isAuthenticated() ? children : <Navigate to="/" />;
  };
  return (
    <>
      {!location.pathname.includes('/auth') && <Navbar /> }
      <main className="main pt-6 w-[100%] ">
      <Routes>  
      <Route path="/" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/my-profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
      <Route path="/auth">
      <Route path="/auth/register" element={<CanAccess><Register /></CanAccess>} />
      <Route path="/auth/login" element={<CanAccess><Login /></CanAccess>} />
      </Route>
      <Route path="/organisation" element={<ProtectedRoute><OrganisationDetails /></ProtectedRoute>} />
      <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
      </Routes>
      </main>
    </>
  );
}

export default App;
