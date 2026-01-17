// src/pages/PayslipGenerate.jsx
import { useEffect, useState } from "react";

export default function PayslipGenerate() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employees, setEmployees] = useState([]);

  const [month, setMonth] = useState("");
  const [payPerDay, setPayPerDay] = useState("");
  const [workingUnit, setWorkingUnit] = useState("");
  const [daysPresent, setDaysPresent] = useState("");

  const [hasAdvance, setHasAdvance] = useState(false);
  const [pendingAdvance, setPendingAdvance] = useState(0);
  const [setOffAdvance, setSetOffAdvance] = useState(0);

  const [generatedSlip, setGeneratedSlip] = useState(null);

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    fetch("http://localhost:3000/api/employee/list-employee")
      .then((res) => res.json())
      .then((json) => setEmployees(json.data || []))
      .catch(console.error);
  }, []);

  /* ================= EMPLOYEE SELECT ================= */
  useEffect(() => {
    if (!employeeName) return;

    const emp = employees.find((e) => e.name === employeeName);
    if (!emp) return;

    setEmployeeCode(emp.employeeCode || "");
    setPayPerDay(emp.payPerDay || emp.wagePerDay || "");
    setWorkingUnit(emp.unit || emp.workingUnit || "");

    fetchEmployeeAdvance(emp.name);
  }, [employeeName]);

  /* ================= FETCH & AGGREGATE ADVANCE ================= */
  const fetchEmployeeAdvance = async (empName) => {
    try {
      const res = await fetch("http://localhost:3000/api/advance/list-advance");
      const json = await res.json();

      const empAdvances = json.data.filter(
        (a) => a.employeeName === empName
      );

      const totalAdvance = empAdvances.reduce(
        (sum, a) => sum + Number(a.advanceAmount || 0),
        0
      );

      if (totalAdvance > 0) {
        setHasAdvance(true);
        setPendingAdvance(totalAdvance);
      } else {
        setHasAdvance(false);
        setPendingAdvance(0);
      }

      setSetOffAdvance(0);
    } catch (err) {
      console.error("Advance fetch error:", err);
    }
  };

  /* ================= CALCULATIONS ================= */
  const salaryPayout =
    (Number(daysPresent) || 0) * (Number(payPerDay) || 0);

  const finalPayout =
    salaryPayout - (Number(setOffAdvance) || 0);

  /* ================= GET MAX DAYS HELPER ================= */

  const getDaysInMonth = (monthValue) => {
    if (!monthValue) return 31;
    const [year, month] = monthValue.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  };

  /* ================= GENERATE PAYSLIP ================= */
  const handleGenerate = async () => {
    const payload = {
      employeeName,
      employeeCode,
      workingUnit,
      month,
      daysPresent: Number(daysPresent),
      wagePerDay: Number(payPerDay),
      salaryPayout,
      hasAdvance,
      pendingAdvance,
      setOffAdvance,
      finalPayout,
      generatedAt: new Date().toLocaleString(),
    };

    try {
      const res = await fetch("http://localhost:3000/api/slip/add-slip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        setGeneratedSlip(json.data);
        alert("Payslip generated successfully");
      } else {
        alert(json.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container pt-5 pb-5">
      <div className="mx-auto" style={{ maxWidth: 520 }}>
        <h3 className="text-center mb-4">Generate Payslip</h3>

        {/* Employee */}
        <label className="form-label">Employee</label>
        <select
          className="form-select"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        >
          <option value="">Select</option>
          {employees.map((e) => (
            <option key={e._id} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>

        {/* Month */}
        <label className="form-label mt-3">Month</label>
        <input
          type="month"
          className="form-control"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        {/* Pay */}
        <label className="form-label mt-3">Pay Per Day</label>
        <input className="form-control" value={payPerDay} disabled />

        {/* Unit */}
        <label className="form-label mt-3">Working Unit</label>
        <input className="form-control" value={workingUnit} disabled />

        {/* Days */}
        <label className="form-label mt-3">
          Days Present {month && `(Max ${getDaysInMonth(month)})`}
        </label>

        <input
          type="number"
          className="form-control"
          value={daysPresent}
          min={0}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => {
            let val = e.target.value;

            // allow empty
            if (val === "") {
              setDaysPresent("");
              return;
            }

            // digits only
            if (!/^\d+$/.test(val)) return;

            const num = Number(val);
            const maxDays = getDaysInMonth(month);

            if (num >= 0 && num <= maxDays) {
              setDaysPresent(val);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
            }
            if (e.key === "-" || e.key === "+") {
              e.preventDefault();
            }
          }}
          onWheel={(e) => e.target.blur()}
        />


        {/* Total */}
        <label className="form-label mt-3">Salary Payout</label>
        <input className="form-control" value={salaryPayout} disabled />

        {/* Active Advance */}
        <label className="form-label mt-3">Active Advance</label>
        <input
          className="form-control"
          value={hasAdvance ? "Yes" : "No"}
          disabled
        />

        {/* ADVANCE SECTION */}
        {hasAdvance && (
          <>
            <label className="form-label mt-3">
              Advance Amount Pending to be Settled
            </label>
            <input
              className="form-control"
              value={pendingAdvance}
              disabled
            />

            <label className="form-label mt-3">Set-off Advance Amount</label>

            <input
              type="number"
              className="form-control"
              min={0}
              max={pendingAdvance}
              inputMode="numeric"
              pattern="[0-9]*"
              value={setOffAdvance === 0 ? "" : setOffAdvance}
              onChange={(e) => {
                let val = e.target.value;

                // allow empty
                if (val === "") {
                  setSetOffAdvance(0);
                  return;
                }

                // digits only
                if (!/^\d+$/.test(val)) return;

                const num = Number(val);

                if (num <= pendingAdvance) {
                  setSetOffAdvance(num);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
                if (e.key === "-" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              onWheel={(e) => e.target.blur()}
            />


            <label className="form-label mt-3">
              Final Payout After Advance Cutoff
            </label>
            <input
              className="form-control"
              value={finalPayout}
              disabled
            />
          </>
        )}

        <button className="btn btn-primary w-100 mt-4" onClick={handleGenerate}>
          Generate Payslip
        </button>

        {generatedSlip && (
          <pre className="bg-light p-3 mt-4 rounded">
            {JSON.stringify(generatedSlip, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
