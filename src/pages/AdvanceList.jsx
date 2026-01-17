// src/pages/AdvanceList.jsx
import { useState, useEffect } from "react";

export default function AdvanceList() {
  const [advances, setAdvances] = useState([]);
  const [search, setSearch] = useState("");

  // Dummy data for demonstration
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        employeeName: "ASHISH FABS",
        monthYear: "01-2026",
        amount: 5000,
        status: "Pending",
      },
      {
        id: 2,
        employeeName: "RPRASHIL KUMAR",
        monthYear: "01-2026",
        amount: 2000,
        status: "Paid",
      },
      {
        id: 3,
        employeeName: "ASHISH FABS",
        monthYear: "02-2026",
        amount: 3000,
        status: "Pending",
      },
    ];
    setAdvances(dummyData);
  }, []);

  const filtered = advances.filter(
    (a) =>
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.monthYear.includes(search)
  );

  return (
    <div className="container py-4">
      <h3 className="mb-4">Advances List</h3>

      <div className="mb-3" style={{ maxWidth: 300 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by employee or month"
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
              <th>Month-Year</th>
              <th>Advance Amount (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((adv, idx) => (
                <tr key={adv.id}>
                  <td>{idx + 1}</td>
                  <td>{adv.employeeName}</td>
                  <td>{adv.monthYear}</td>
                  <td>{adv.amount}</td>
                  <td>{adv.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted">
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
