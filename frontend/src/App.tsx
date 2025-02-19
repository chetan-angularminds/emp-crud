import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from './pages/register';
import Login from './pages/login';
import OrganisationDetails from './pages/organisation';
import Employees from './pages/employees';
import { Navigate } from "react-router-dom";
import { JSX } from "react";
function App() {

  const isAuthenticated = () => {
    // Add your authentication logic here
    return localStorage.getItem("token") !== null;
  };

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="/auth/login" />;
  };
  return (
    <>
    <Navbar/>
      <main className="main-content">
      <Routes>
        <Route path="/" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        <Route path="/auth">
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
        </Route>
        <Route path="/organisation" element={<ProtectedRoute><OrganisationDetails /></ProtectedRoute>} />
      </Routes>
      </main>
    </>
  );
}

export default App;
