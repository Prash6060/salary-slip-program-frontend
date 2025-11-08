// src/pages/EmployeesList.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/global.css";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  // sorting (Pay/Day only)
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // filters
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");

  // popover control
  const [openFilter, setOpenFilter] = useState(null); // 'role' | 'unit' | null
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const popoverRef = useRef(null);
  const roleIconRef = useRef(null);
  const unitIconRef = useRef(null);

  useEffect(() => {
    setEmployees([
      { name: "Rahul Sharma", wagePerDay: 950, role: "Supervisor", unit: "Unit A" },
      { name: "Amit Singh", wagePerDay: 750, role: "Technician", unit: "Unit B" },
      { name: "Pooja Patel", wagePerDay: 830, role: "Operator", unit: "Unit A" },
      { name: "Rakesh Kumar", wagePerDay: 900, role: "Fitter", unit: "Unit C" },
    ]);
  }, []);

  // options for filters (always in sync with data)
  const roleOptions = useMemo(() => ["all", ...Array.from(new Set(employees.map(e => e.role)))], [employees]);
  const unitOptions = useMemo(() => ["all", ...Array.from(new Set(employees.map(e => e.unit)))], [employees]);

  const handleSort = (field) => {
    if (field !== "wagePerDay") return;
    if (sortField === field) setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // filtering pipeline
  const filteredByName = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredByRole = selectedRole === "all" ? filteredByName : filteredByName.filter(e => e.role === selectedRole);
  const filteredByUnit = selectedUnit === "all" ? filteredByRole : filteredByRole.filter(e => e.unit === selectedUnit);

  // apply sort
  const finalEmployees = [...filteredByUnit].sort((a, b) => {
    if (!sortField) return 0;
    if (sortOrder === "asc") return a[sortField] > b[sortField] ? 1 : -1;
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  // sort chevron
  const renderSortIcon = (field) => {
    if (field !== "wagePerDay") return null;
    if (sortField !== field) return <span className="ms-1 small">⇅</span>;
    return sortOrder === "asc" ? <span className="ms-1 small">▲</span> : <span className="ms-1 small">▼</span>;
  };

  // filter icon (inline SVG)
  const FilterIcon = ({ active, iconRef }) => (
    <svg
      ref={iconRef}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`ms-1 filter-btn ${active ? "filter-btn-active" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // open popover anchored to icon (viewport coords)
  const openPopover = (type) => {
    const ref = type === "role" ? roleIconRef : unitIconRef;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // place below/right of icon with small gap
    setPopoverPos({ top: r.bottom + 6 + window.scrollY, left: r.left + window.scrollX });
    setOpenFilter(type);
  };

  // close on outside click / Esc / resize / scroll
// close on outside click / Esc / OUTSIDE scroll/resize
useEffect(() => {
  const onDocClick = (e) => {
    if (!openFilter) return;
    if (popoverRef.current && !popoverRef.current.contains(e.target)) {
      setOpenFilter(null);
    }
  };

  const onKey = (e) => e.key === "Escape" && setOpenFilter(null);

  // Close on scroll only if the scroll target is NOT the popover (or inside it)
  const onScroll = (e) => {
    if (!openFilter) return;
    if (popoverRef.current && popoverRef.current.contains(e.target)) return; // ignore popover's own scroll
    setOpenFilter(null);
  };

  const onResize = () => setOpenFilter(null);

  document.addEventListener("mousedown", onDocClick, true);
  document.addEventListener("keydown", onKey, true);
  // capture scrolls from any element
  document.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", onResize);

  return () => {
    document.removeEventListener("mousedown", onDocClick, true);
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("scroll", onScroll, true);
    window.removeEventListener("resize", onResize);
  };
}, [openFilter]);


  // popover content
  const PopoverList = ({ type, options, value, onSelect }) => (
    <div
      ref={popoverRef}
      className="filter-popover shadow rounded-3"
      style={{
        position: "fixed",
        top: popoverPos.top,
        left: popoverPos.left,
        background: "#fff",
        border: "1px solid #e5e7eb",
        minWidth: 220,
        maxHeight: 260,
        overflowY: "auto",
        zIndex: 9999,
      }}
    >
      <div className="p-2 border-bottom fw-semibold small text-secondary">
        {type === "role" ? "Filter by Role" : "Filter by Unit"}
      </div>
      <div className="py-1">
        {options.map(opt => {
          const label = opt === "all" ? (type === "role" ? "All Roles" : "All Units") : opt;
          const active = value === opt;
          return (
            <div
              key={opt}
              role="button"
              className={`px-3 py-2 filter-option ${active ? "active" : ""}`}
              onClick={() => {
                onSelect(opt);
                setOpenFilter(null);
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <input type="radio" readOnly checked={active} />
                <span>{label}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-2 py-2 border-top d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-sm btn-light" onClick={() => setOpenFilter(null)}>
          Close
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            if (type === "role") setSelectedRole("all");
            else setSelectedUnit("all");
            setOpenFilter(null);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* heading row */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-semibold">Employees List</h3>

        <input
          type="text"
          placeholder="Search Employee..."
          className="modern-search"
          style={{ minWidth: 120 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div style={{ height: 4, background: "linear-gradient(90deg,#7db1ff,#4f86f7)" }} />
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-animated">
              <thead
                style={{
                  background: "linear-gradient(90deg, #bcd7ff 0%, #d9e7ff 45%, #f0f6ff 100%)",
                  borderBottom: "3px solid #8ab3ff",
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                }}
              >
                <tr>
                  <th className="py-3 px-3 text-dark fw-bold small text-uppercase">Sr.No</th>
                  <th className="py-3 px-3 text-dark fw-bold small text-uppercase">Employee Name</th>

                  {/* Pay/Day: sortable */}
                  <th
                    className="py-3 px-3 text-dark fw-bold small text-uppercase position-relative"
                    style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                    onClick={() => handleSort("wagePerDay")}
                    title="Click to sort by Pay / Day"
                  >
                    Pay / Day (₹) {renderSortIcon("wagePerDay")}
                  </th>

                  {/* Role with filter icon */}
                  <th className="py-3 px-3 text-dark fw-bold small text-uppercase position-relative">
                    <div className="d-inline-flex align-items-center">
                      Role
                      <span
                        ref={roleIconRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          openPopover(openFilter === "role" ? null : "role");
                        }}
                        title="Filter by Role"
                        aria-label="Filter by Role"
                      >
                        <FilterIcon active={openFilter === "role" || selectedRole !== "all"} />
                      </span>
                    </div>
                  </th>

                  {/* Unit with filter icon */}
                  <th className="py-3 px-3 text-dark fw-bold small text-uppercase position-relative">
                    <div className="d-inline-flex align-items-center">
                      Working Unit
                      <span
                        ref={unitIconRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          openPopover(openFilter === "unit" ? null : "unit");
                        }}
                        title="Filter by Unit"
                        aria-label="Filter by Unit"
                      >
                        <FilterIcon active={openFilter === "unit" || selectedUnit !== "all"} />
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {finalEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-5 text-center text-muted">
                      No employee records found.
                    </td>
                  </tr>
                ) : (
                  finalEmployees.map((emp, i) => (
                    <tr key={i} className="employee-row">
                      <td className="py-3 px-3 srno-cell">{i + 1}</td>
                      <td className="py-3 px-3 fw-medium">{emp.name}</td>
                      <td className="py-3 px-3">₹ {Number(emp.wagePerDay).toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className="badge role-badge">{emp.role}</span>
                      </td>
                      <td className="py-3 px-3">{emp.unit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render the fixed-position popover at the end so it isn't clipped */}
      {openFilter === "role" && (
        <PopoverList
          type="role"
          options={roleOptions}
          value={selectedRole}
          onSelect={setSelectedRole}
        />
      )}
      {openFilter === "unit" && (
        <PopoverList
          type="unit"
          options={unitOptions}
          value={selectedUnit}
          onSelect={setSelectedUnit}
        />
      )}
    </div>
  );
}
