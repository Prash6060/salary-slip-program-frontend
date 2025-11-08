// src/pages/EmployeeOnboard.jsx
import { useState } from "react";
import "../styles/global.css";

export default function EmployeeOnboard() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [wagePerDay, setWagePerDay] = useState("");
  const [workingUnit, setWorkingUnit] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const payload = {
      name: fullName,
      role,
      wagePerDay: Number(wagePerDay),
      unit: workingUnit,
    };

    try {
      setSubmitting(true)

      const res = await fetch("http://localhost:3000/api/employee/add-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // handle non-2xx
      if (!res.ok) {
        let detail = "";
        try {
          const errJson = await res.json();
          detail = errJson?.msg || JSON.stringify(errJson);
        } catch {
          detail = await res.text();
        }
        throw new Error(detail || `HTTP ${res.status}`);
      }

      const data = await res.json(); // { msg, data: {...employee} }
      const code = data?.data?.code ? ` (${data.data.code})` : "";
      setSuccessMsg(`Employee onboarded successfully${code}.`);
      // reset form
      setFullName("");
      setRole("");
      setWagePerDay("");
      setWorkingUnit("");
    } catch (err) {
      setErrorMsg(`Failed to onboard employee. ${err?.message ?? ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-semibold mb-3">Employees — Onboard</h3>

      {/* alerts */}
      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="d-flex justify-content-center">
        <form
          onSubmit={handleSubmit}
          className="card border-0 shadow-sm rounded-4 p-4"
          style={{ maxWidth: 780, width: "100%" }}
        >
          <div className="mb-3">
            <label className="form-label fw-medium">Full Name</label>
            <input
              type="text"
              className="classic-input form-control text-uppercase"
              value={fullName}
              onChange={(e) => setFullName(e.target.value.toUpperCase())}
              placeholder="ENTER FULL NAME"
              required
              disabled={submitting}
            />

          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={submitting}
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
              min={0}
              step="1"
              disabled={submitting}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Working Unit</label>
            <select
              className="form-select"
              value={workingUnit}
              onChange={(e) => setWorkingUnit(e.target.value)}
              required
              disabled={submitting}
            >
              <option value="">Select Unit</option>
              <option value="Unit A">Unit A</option>
              <option value="Unit B">Unit B</option>
              <option value="Unit C">Unit C</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4 fw-semibold"
            disabled={submitting}
          >
            {submitting ? "Onboarding…" : "Onboard Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}
