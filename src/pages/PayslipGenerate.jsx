// src/pages/PayslipGenerate.jsx
import { useEffect, useState } from "react";

export default function PayslipGenerate() {
  const [employeeName, setEmployeeName] = useState("");
  const [employees, setEmployees] = useState([]); // <-- for dropdown
  const [month, setMonth] = useState("");
  const [daysPresent, setDaysPresent] = useState("");
  const [generatedSlip, setGeneratedSlip] = useState(null);

  // fetch employees list once on load
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/employee/list-employee");
        const json = await res.json();
        if (json?.data) setEmployees(json.data);
      } catch (err) {
        console.error("Error loading employee list:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleGenerate = () => {
    const wagePerDay = 1000; // dummy hardcoded
    const totalPay = Number(daysPresent) * wagePerDay;

    let m = "";
    let y = "";
    if (month) {
      const parts = month.split("-");
      y = parts[0];
      m = parts[1];
    }

    const slip = {
      employeeName,
      month: m,
      year: y,
      daysPresent,
      wagePerDay,
      totalPay,
      generatedAt: new Date().toLocaleString(),
    };

    setGeneratedSlip(slip);
  };

  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center"
      style={{ height: "calc(100vh - 56px)" }} // exact center under navbar
    >
      <div style={{ width: 500, maxWidth: "90%" }}>
        <h3 className="mb-4 text-center">Generate Payslip</h3>

        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-medium">Employee Name</label>

            <select
              className="form-select"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label fw-medium">Month</label>
            <input
              type="month"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-medium">Days Present</label>
            <input
              type="number"
              className="form-control"
              value={daysPresent}
              onChange={(e) => setDaysPresent(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button className="btn btn-primary w-100 mt-2" onClick={handleGenerate}>
              Generate Payslip
            </button>
          </div>
        </div>

        {generatedSlip && (
          <div className="mt-5">
            <h5 className="text-center">Payslip Output (dummy)</h5>
            <pre className="border rounded p-3 bg-light">
{JSON.stringify(generatedSlip, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
