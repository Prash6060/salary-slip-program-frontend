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
import PayslipGenerate from "./pages/PayslipGenerate";

// Advances
import Advances from "./pages/Advance";
import AdvancesList from "./pages/AdvanceList";
//import AdvancesAdd from "./pages/AdvancesAdd";
//import AdvancesUpdate from "./pages/AdvancesUpdate";

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
              <Route index element={<Employees />} />
              <Route path="list" element={<EmployeesList />} />
              <Route path="onboard" element={<EmployeeOnboard />} />
              <Route path="update-wage" element={<EmployeeUpdateWage />} />
              <Route path="delete" element={<EmployeeDelete />} />
            </Route>

            {/* Payslips section */}
            <Route path="/payslips">
              <Route index element={<Payslips />} />
              <Route path="generate" element={<PayslipGenerate />} />
            </Route>

            {/* Advances section */}
            <Route path="/advances">
              {/* Landing/options grid */}
              <Route index element={<Advances />} />
              {/* Sub-pages */}
              <Route path="list" element={<AdvancesList />} />
              {/*<Route path="add" element={<AdvancesAdd />} /> */}
              {/* <Route path="update" element={<AdvancesUpdate />} /> */}
            </Route>

            {/* future protected routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
