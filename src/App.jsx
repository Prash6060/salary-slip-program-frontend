// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Employees
import Employees from "./pages/Employees";
import EmployeesList from "./pages/EmployeesList";
import EmployeeOnboard from "./pages/EmployeeOnboard";
import EmployeeUpdateWage from "./pages/EmployeeUpdateWage";
import EmployeeDelete from "./pages/EmployeeDelete";

// Payslips
import Payslips from "./pages/PaySlips";
// import PayslipsList from "./pages/PayslipsList";            // /payslips/list
import PayslipGenerate from "./pages/PayslipGenerate";      // /payslips/generate
// import PayslipsBulkGenerate from "./pages/PayslipsBulkGenerate"; // /payslips/bulk-generate
// import PayslipsSettings from "./pages/PayslipsSettings";    // /payslips/settings

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
              {/* Landing/options grid */}
              <Route index element={<Employees />} />
              {/* Sub-pages */}
              <Route path="list" element={<EmployeesList />} />
              <Route path="onboard" element={<EmployeeOnboard />} />
              <Route path="update-wage" element={<EmployeeUpdateWage />} />
              <Route path="delete" element={<EmployeeDelete />} />
            </Route>

            {/* Payslips section */}
            <Route path="/payslips">
              {/* Landing/options grid */}
              <Route index element={<Payslips />} />
              {/* Sub-pages */}
              <Route path="generate" element={<PayslipGenerate />} />
              {/* <Route path="list" element={<PayslipsList />} /> */}
              {/* <Route path="bulk-generate" element={<PayslipsBulkGenerate />} /> */}
              {/* <Route path="settings" element={<PayslipsSettings />} /> */}
            </Route>

            {/* future protected routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
