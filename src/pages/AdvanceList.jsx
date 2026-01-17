// src/pages/AdvanceList.jsx
import { useState, useEffect } from "react";

export default function AdvanceList() {
  const [advances, setAdvances] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH ADVANCE DATA ================= */
  useEffect(() => {
    const fetchAdvances = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/advance/list-advance");
        const json = await res.json();
        if (json.data) {
          setAdvances(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch advances:", err);
      }
    };

    fetchAdvances();
  }, []);

  /* ================= AGGREGATE POSITIVE ADVANCE ================= */
  const aggregateByEmployee = () => {
    const map = {};

    advances.forEach((adv) => {
      if (!map[adv.employeeName]) map[adv.employeeName] = 0;
      map[adv.employeeName] += Number(adv.advanceAmount || 0);
    });

    // Keep only employees with positive aggregate advance
    const result = Object.entries(map)
      .map(([employeeName, total]) => ({ employeeName, total }))
      .filter((e) => e.total > 0);

    return result;
  };

  const filtered = aggregateByEmployee().filter(
    (a) =>
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.total.toString().includes(search)
  );

  return (
    <div className="container py-4">
      <h3 className="mb-4">Advance List (Positive Aggregates)</h3>

      <div className="mb-3" style={{ maxWidth: 300 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by employee or amount"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Net Advance Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((adv, idx) => (
                <tr key={adv.employeeName}>
                  <td>{idx + 1}</td>
                  <td>{adv.employeeName}</td>
                  <td>{adv.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
