// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeesList from "./pages/EmployeesList";
import EmployeeOnboard from "./pages/EmployeeOnboard";
import EmployeeUpdateWage from "./pages/EmployeeUpdateWage";
import EmployeeDelete from "./pages/EmployeeDelete";
import RequireAuth from "./components/RequireAuth";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected group */}
        <Route element={<RequireAuth />}>
          <Route element={<NavBar />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Employees section */}
            <Route path="/employees">
              {/* Landing/options grid (your Employees.jsx) */}
              <Route index element={<Employees />} />
              {/* Sub-pages */}
              <Route path="list" element={<EmployeesList />} />
              <Route path="onboard" element={<EmployeeOnboard />} />
              <Route path="update-wage" element={<EmployeeUpdateWage />} />
              <Route path="delete" element={<EmployeeDelete />} />
            </Route>

            {/* future protected routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
