// src/pages/AdvanceDetail.jsx
import { useState, useEffect } from "react";
import "../styles/global.css";

export default function AdvanceDetail() {
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // sorting state
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  // ======= FETCH ADVANCE DATA =======
  useEffect(() => {
    const ctrl = new AbortController();

    async function loadAdvances() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:3000/api/advance/list-advance", {
          signal: ctrl.signal,
        });
        if (!res.ok) {
          if (res.status === 404) {
            setAdvances([]);
            setLoading(false);
            return;
          }
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }

        const json = await res.json();
        if (Array.isArray(json.data)) {
          setAdvances(json.data);
        } else {
          setAdvances([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to fetch advance data. " + (err.message || ""));
        }
      } finally {
        setLoading(false);
      }
    }

    loadAdvances();
    return () => ctrl.abort();
  }, []);

  // ======= FORMAT DATE =======
  const formatDate = (str) => {
    if (!str) return "";
    const [dd, mm, yyyy] = str.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  // ======= HANDLE DATE SORT =======
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedAdvances = [...advances]
    .sort((a, b) => {
      if (!a.advanceDate || !b.advanceDate) return 0;
      const [aD, aM, aY] = a.advanceDate.split("-").map(Number);
      const [bD, bM, bY] = b.advanceDate.split("-").map(Number);
      const dateA = new Date(aY, aM - 1, aD);
      const dateB = new Date(bY, bM - 1, bD);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    })
    // filter only by employee name
    .filter((a) => a.employeeName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container py-4">
      <h3 className="mb-4">Advance Collection Details</h3>

      <div className="mb-3" style={{ maxWidth: 300 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by employee name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div style={{ height: 4, background: "linear-gradient(90deg,#7db1ff,#4f86f7)" }} />
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5 text-center text-muted">Loading advances…</div>
          ) : error ? (
            <div className="py-5 text-center text-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 px-3 text-dark fw-bold small text-uppercase">Sr. No</th>
                    <th className="py-3 px-3 text-dark fw-bold small text-uppercase">Employee Name</th>
                    
                    {/* Advance Date with sort icon */}
                    <th
                      className="py-3 px-3 text-dark fw-bold small text-uppercase"
                      style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                      onClick={toggleSortOrder}
                      title="Click to sort by Advance Date"
                    >
                      Advance Date{" "}
                      {sortOrder === "asc" ? (
                        <span className="small">▲</span>
                      ) : (
                        <span className="small">▼</span>
                      )}
                    </th>

                    <th className="py-3 px-3 text-dark fw-bold small text-uppercase">Advance Amount (₹)</th>
                    <th className="py-3 px-3 text-dark fw-bold small text-uppercase">Approved By</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedAdvances.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-5 text-center text-muted">
                        No advance records found.
                      </td>
                    </tr>
                  ) : (
                    sortedAdvances.map((adv, idx) => (
                      <tr key={adv._id}>
                        <td className="py-3 px-3">{idx + 1}</td>
                        <td className="py-3 px-3">{adv.employeeName}</td>
                        <td className="py-3 px-3">{formatDate(adv.advanceDate)}</td>
                        <td
                          className="py-3 px-3 fw-semibold"
                          style={{ color: adv.advanceAmount > 0 ? "green" : "red" }}
                        >
                          {adv.advanceAmount}
                        </td>
                        <td className="py-3 px-3">{adv.approvedBy}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
