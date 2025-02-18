import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from './pages/register';
import Login from './pages/login';
import OrganisationDetails from './pages/organisation';
import Employees from './pages/employees';
function App() {
  return (
    <>
    <Navbar/>
      <main className="main-content">
      <Routes>
            
            <Route  path="/" element={<Employees/>} />
            <Route path="/auth">
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/login" element={<Login />} />
            </Route>
            <Route path="/organisation" element={<OrganisationDetails />} />
        
    </Routes>
      </main>
    </>
  );
}

export default App;
