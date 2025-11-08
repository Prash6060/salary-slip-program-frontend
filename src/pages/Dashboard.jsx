// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function HoverCard({ children, onClick }) {
  const [hover, setHover] = useState(false);

  const style = useMemo(
    () => ({
      cursor: onClick ? "pointer" : "default",
      border: `1px solid ${hover ? "#b6d4fe" : "#e8f1ff"}`,
      background:
        "linear-gradient(180deg, rgba(233,244,255,0.6) 0%, rgba(255,255,255,0.9) 100%)",
      boxShadow: hover
        ? "0 1rem 2rem rgba(13,110,253,0.18)"
        : "0 .6rem 1.2rem rgba(13,110,253,0.10)",
      transform: hover ? "translateY(-2px)" : "translateY(0)",
      transition: "all 160ms ease",
    }),
    [hover, onClick]
  );

  return (
    <div
      className="card border-0 h-100"
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    advancesThisMonth: 0,
    totalPayoutThisMonth: 0,
    pendingPayslips: 0,
  });

  useEffect(() => {
    // TODO: replace with /api/dashboard/stats
    const t = setTimeout(() => {
      setStats({
        totalEmployees: 12,
        advancesThisMonth: 35000,
        totalPayoutThisMonth: 680000,
        pendingPayslips: 3,
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="container py-5">Loading dashboard...</div>;

  const topCards = [
    {
      emoji: "🧑‍💼",
      title: "Employee Data",
      subtitle: "View & manage employees",
      stat: `${stats.totalEmployees}`,
      badge: "Employees",
      onClick: () => navigate("/employees"),
    },
    {
      emoji: "🧾",
      title: "Payslips Data",
      subtitle: "Generate & view payslips",
      stat: `${stats.pendingPayslips}`,
      badge: "Pending",
      onClick: () => navigate("/payslips"),
    },
    {
      emoji: "💸",
      title: "Advance Data",
      subtitle: "Record & track advances",
      stat: `₹ ${stats.advancesThisMonth.toLocaleString()}`,
      badge: "This month",
      onClick: () => navigate("/advances"),
    },
    {
      emoji: "📊",
      title: "Analytics Data",
      subtitle: "KPIs & monthly trends",
      stat: `₹ ${stats.totalPayoutThisMonth.toLocaleString()}`,
      badge: "Payout (mo.)",
      onClick: () => navigate("/dashboard"), // update to analytics route later
    },
  ];

  return (
    <div className="container py-4">
      <h3 className="mb-2 fw-semibold">Dashboard</h3>

      {/* 2×2 matrix (top section) */}
      <div className="row g-3 mb-4">
        {topCards.map((c, i) => (
          <div className="col-12 col-md-6" key={i}>
            <HoverCard onClick={c.onClick}>
              <div className="card-body py-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-start gap-3">
                    <span
                      aria-hidden
                      style={{
                        fontSize: 28,
                        lineHeight: 1,
                        background: "#e7f1ff",
                        borderRadius: 8,
                        padding: "6px 8px",
                      }}
                    >
                      {c.emoji}
                    </span>
                    <div>
                      <div className="fw-semibold fs-5">{c.title}</div>
                      <div className="text-muted small">{c.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="badge text-bg-primary">{c.badge}</div>
                    <div className="fs-5 fw-semibold mt-1">{c.stat}</div>
                  </div>
                </div>
              </div>
            </HoverCard>
          </div>
        ))}
      </div>

      {/* Quick Actions (2 columns per row, total 2 rows) */}
      <h5 className="mt-4 mb-3 fw-semibold">Quick Actions</h5>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <HoverCard onClick={() => navigate("/employees")}>
            <div className="card-body text-center py-4">
              <div className="fw-semibold fs-6">Add / Manage Employees</div>
              <div className="text-muted small">Create | Edit | Delete</div>
            </div>
          </HoverCard>
        </div>

        <div className="col-12 col-md-6">
          <HoverCard onClick={() => navigate("/attendance")}>
            <div className="card-body text-center py-4">
              <div className="fw-semibold fs-6">Daily Attendance</div>
              <div className="text-muted small">Mark staff attendance</div>
            </div>
          </HoverCard>
        </div>

        <div className="col-12 col-md-6">
          <HoverCard onClick={() => navigate("/payslips/generate")}>
            <div className="card-body text-center py-4">
              <div className="fw-semibold fs-6">Generate Payslip</div>
              <div className="text-muted small">Monthly payout processing</div>
            </div>
          </HoverCard>
        </div>

        <div className="col-12 col-md-6">
          <HoverCard onClick={() => navigate("/advances")}>
            <div className="card-body text-center py-4">
              <div className="fw-semibold fs-6">Employee Advance</div>
              <div className="text-muted small">Issue partial advance salary</div>
            </div>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
