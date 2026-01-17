// src/pages/PayslipGenerate.jsx
import { useEffect, useState } from "react";

export default function PayslipGenerate() {
  const [employeeName, setEmployeeName] = useState("");
  const [employees, setEmployees] = useState([]); // for dropdown
  const [month, setMonth] = useState(""); // "YYYY-MM"
  const [payPerDay, setPayPerDay] = useState(""); // auto-filled, editable
  const [workingUnit, setWorkingUnit] = useState(""); // auto-filled, disabled
  const [daysPresent, setDaysPresent] = useState("");
  const [hasAdvance, setHasAdvance] = useState(false); // boolean toggle
  const [advanceAmount, setAdvanceAmount] = useState(""); // enabled if hasAdvance
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

  // when employee is selected, auto-fill payPerDay and workingUnit from API data
  useEffect(() => {
    if (!employeeName) {
      setPayPerDay("");
      setWorkingUnit("");
      return;
    }
    const selected = employees.find((emp) => emp?.name === employeeName);
    if (selected) {
      const detectedPayPerDay =
        selected.payPerDay ??
        selected.wagePerDay ??
        selected.dailyWage ??
        selected.salaryPerDay ??
        "";
      const detectedWorkingUnit =
        selected.workingUnit ??
        selected.unit ??
        selected.department ??
        "";

      setPayPerDay(
        detectedPayPerDay !== undefined && detectedPayPerDay !== null
          ? String(detectedPayPerDay)
          : ""
      );
      setWorkingUnit(
        detectedWorkingUnit !== undefined && detectedWorkingUnit !== null
          ? String(detectedWorkingUnit)
          : ""
      );
    } else {
      setPayPerDay("");
      setWorkingUnit("");
    }
  }, [employeeName, employees]);

  // Clear advance amount if user toggles off hasAdvance
  useEffect(() => {
    if (!hasAdvance) setAdvanceAmount("");
  }, [hasAdvance]);

  const totalPayout = (Number(daysPresent) || 0) * (Number(payPerDay) || 0);

  // Label for month (e.g., "November")
  const selectedMonthName = month
    ? new Date(month + "-01").toLocaleString("default", { month: "long" })
    : "";

  const handleGenerate = () => {
    const wagePerDay = Number(payPerDay) || 0;
    const totalPay = (Number(daysPresent) || 0) * wagePerDay;

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
      workingUnit,
      daysPresent: Number(daysPresent) || 0,
      wagePerDay,
      hasAdvance,
      advanceAmount: hasAdvance ? Number(advanceAmount) || 0 : 0,
      totalPay, // payout before any deductions/adjustments
      generatedAt: new Date().toLocaleString(),
    };

    setGeneratedSlip(slip);
  };

  const getDaysInSelectedMonth = () => {
    if (!month) return 31; // fallback

    const [year, monthIndex] = month.split("-").map(Number);
    // monthIndex: 1–12 → JS expects 0–11
    return new Date(year, monthIndex, 0).getDate();
  };

  useEffect(() => {
    if (!month) return;

    const maxDays = getDaysInSelectedMonth();
    if (Number(daysPresent) > maxDays) {
      setDaysPresent(String(maxDays));
    }
  }, [month]);


  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center pt-5 pb-5"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >

      <div style={{ width: 500, maxWidth: "90%" }}>
        <h3 className="mb-4 text-center">Generate Payslip</h3>

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
                <option key={emp._id || emp.id || emp.name} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="col-12">
            <label className="form-label fw-medium">Month</label>
            <input
              type="month"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          {/* Pay Per Day (auto-filled but editable) */}
          <div className="col-12">
            <label className="form-label fw-medium">Pay Per Day</label>
            <input
              type="number"
              className="form-control"
              value={payPerDay}
              disabled
              readOnly
            />
          </div>

          {/* Working Unit (auto-filled and DISABLED) */}
          <div className="col-12">
            <label className="form-label fw-medium">Working Unit</label>
            <input
              type="text"
              className="form-control"
              value={workingUnit}
              disabled
              readOnly
            />
          </div>

          {/* Days Present */}
          <div className="col-12">
            <label className="form-label fw-medium">
              Days Present
              {month && ` (Max ${getDaysInSelectedMonth()})`}
            </label>

            <input
              type="number"
              className="form-control"
              value={daysPresent}
              min={0}
              step={1}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                let value = e.target.value;

                // allow empty while typing
                if (value === "") {
                  setDaysPresent("");
                  return;
                }

                // digits only
                if (!/^\d+$/.test(value)) return;

                const numericValue = Number(value);
                const maxDays = getDaysInSelectedMonth();

                if (numericValue <= maxDays) {
                  setDaysPresent(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>


          {/* Total Payout label uses the currently selected month */}
          {daysPresent !== "" && (
            <div className="col-12">
              <label className="form-label fw-medium">
                Total Payout{selectedMonthName ? ` (${selectedMonthName})` : ""}
              </label>
              <input
                type="number"
                className="form-control"
                value={totalPayout}
                readOnly
                disabled
              />
            </div>
          )}

          {/* Active Advance toggle */}
          <div className="col-12">
            <label className="form-label fw-medium d-block">
              Active Advance
              {selectedMonthName ? ` (${selectedMonthName})` : ""}
            </label>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="activeAdvanceSwitch"
                checked={hasAdvance}
                onChange={(e) => setHasAdvance(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="activeAdvanceSwitch">
                {hasAdvance ? "Yes" : "No"}
              </label>
            </div>
          </div>

          {/* Advance Amount (enabled only if Active Advance is true) */}
          <div className="col-12">
            <label className="form-label fw-medium">
              Advance Amount
            </label>

            <input
              type="number"
              className="form-control"
              value={advanceAmount}
              min={0}
              step={1}
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={!hasAdvance}
              onChange={(e) => {
                let value = e.target.value;

                // allow empty while typing
                if (value === "") {
                  setAdvanceAmount("");
                  return;
                }

                // digits only (no negative / no decimal)
                if (!/^\d+$/.test(value)) return;

                setAdvanceAmount(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
              }}
              onWheel={(e) => e.target.blur()}
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
            <h5 className="text-center">Payslip Output</h5>
            <pre className="border rounded p-3 bg-light">
              {JSON.stringify(generatedSlip, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
