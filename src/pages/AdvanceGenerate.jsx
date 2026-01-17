// src/pages/AdvanceGenerate.jsx
import { useEffect, useState } from "react";

export default function AdvanceGenerate() {
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [unit, setUnit] = useState(""); // auto-filled and disabled
  const [advanceDate, setAdvanceDate] = useState(""); // dd-mm-yyyy
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [generatedAdvance, setGeneratedAdvance] = useState(null);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/employee/list-employee");
        const json = await res.json();
        if (json?.data) setEmployees(json.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // Update unit when employee is selected
  useEffect(() => {
    if (!employeeName) {
      setUnit("");
      return;
    }
    const emp = employees.find((e) => e.name === employeeName);
    if (emp) {
      setUnit(emp.unit ?? emp.workingUnit ?? "");
    } else {
      setUnit("");
    }
  }, [employeeName, employees]);

  // Auto-format ddmmyyyy → dd-mm-yyyy
  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1-$2-$3");
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{1,2})/, "$1-$2");
    }

    setAdvanceDate(value);
  };

  // Handle generate
  const handleGenerate = () => {
    if (!employeeName || !advanceDate || !advanceAmount || !approvedBy) {
      alert("Please fill all required fields");
      return;
    }

    const advance = {
      employeeName,
      unit,
      advanceDate,
      advanceAmount: Number(advanceAmount),
      approvedBy,
      status: "Pending",
      generatedAt: new Date().toLocaleString(),
    };

    setGeneratedAdvance(advance);
    // reset
    setAdvanceDate("");
    setAdvanceAmount("");
    setApprovedBy("");
  };

  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center pt-5 pb-5"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div style={{ width: 500, maxWidth: "90%" }}>
        <h3 className="mb-4 text-center">Generate Advance</h3>

        <div className="row g-3">
          {/* Employee */}
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

          {/* Unit (auto-filled, disabled) */}
          <div className="col-12">
            <label className="form-label fw-medium">Unit</label>
            <input
              type="text"
              className="form-control"
              value={unit}
              disabled
              readOnly
            />
          </div>

          {/* Date of Advance Taken */}
          <div className="col-12">
            <label className="form-label fw-medium">Date of Advance Taken</label>
            <input
              type="text"
              className="form-control"
              placeholder="DD-MM-YYYY"
              value={advanceDate}
              onChange={handleDateChange}
            />
          </div>

          {/* Advance Amount */}
          <div className="col-12">
            <label className="form-label fw-medium">Advance Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={advanceAmount}
              min={0}
              onChange={(e) => {
                let value = e.target.value;
                if (!/^\d*$/.test(value)) return; // digits only
                setAdvanceAmount(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          {/* Approved By */}
          <div className="col-12">
            <label className="form-label fw-medium">Approved By</label>
            <select
              className="form-select"
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
            >
              <option value="">Select Approver</option>
              <option value="Mahendra Gulechha">Mahendra Gulechha</option>
              <option value="Rajendra Gulechha">Rajendra Gulechha</option>
              <option value="Vinod Gulechha">Vinod Gulechha</option>
            </select>
          </div>

          {/* Generate button */}
          <div className="col-12">
            <button
              className="btn btn-primary w-100 mt-2"
              onClick={handleGenerate}
            >
              Generate Advance
            </button>
          </div>
        </div>

        {/* Output */}
        {generatedAdvance && (
          <div className="mt-5">
            <h5 className="text-center">Advance Generated</h5>
            <pre className="border rounded p-3 bg-light">
              {JSON.stringify(generatedAdvance, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
