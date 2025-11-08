// src/pages/EmployeeOnboard.jsx
import { useState } from "react";
import "../styles/global.css";

export default function EmployeeOnboard() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [wagePerDay, setWagePerDay] = useState("");
  const [workingUnit, setWorkingUnit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = {
      name: fullName,
      role,
      wagePerDay: Number(wagePerDay),
      unit: workingUnit
    };

    console.log("NEW EMPLOYEE ONBOARD :", newEmployee);

    // TODO: POST -> /api/employees
    // fetch("/api/employees", {method:"POST", body: JSON.stringify(newEmployee)})

    // reset form
    setFullName("");
    setRole("");
    setWagePerDay("");
    setWorkingUnit("");
  };

  return (
    <div className="container py-4">
      <h3 className="fw-semibold mb-3">Employees — Onboard</h3>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit} className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: 780, width: "100%" }}>

          <div className="mb-3">
            <label className="form-label fw-medium">Full Name</label>
            <input
              type="text"
              className="classic-input form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter Full Name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Technician">Technician</option>
              <option value="Operator">Operator</option>
              <option value="Fitter">Fitter</option>
            </select>
          </div>


          <div className="mb-3">
            <label className="form-label fw-medium">Wage Per Day (₹)</label>
            <input
              type="number"
              className="classic-input form-control"
              value={wagePerDay}
              onChange={(e) => setWagePerDay(e.target.value)}
              placeholder="Per day pay"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Working Unit</label>
            <select
              className="form-select"
              value={workingUnit}
              onChange={(e) => setWorkingUnit(e.target.value)}
              required
            >
              <option value="">Select Unit</option>
              <option value="Unit A">Unit A</option>
              <option value="Unit B">Unit B</option>
              <option value="Unit C">Unit C</option>
            </select>
          </div>


          <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">
            Onboard Employee
          </button>
        </form>
      </div>
    </div>
  );
}
