import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    advancesThisMonth: 0,
    totalPayoutThisMonth: 0,
    pendingPayslips: 0
  });

  useEffect(() => {
    // later this will call e.g. /api/dashboard/stats
    // for now dummy sample values
    setTimeout(() => {
      setStats({
        totalEmployees: 12,
        advancesThisMonth: 35000,
        totalPayoutThisMonth: 680000,
        pendingPayslips: 3
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="container py-5">Loading dashboard...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-semibold">Dashboard</h3>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Total Employees</div>
              <div className="fs-3 fw-semibold">{stats.totalEmployees}</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Advances (this month)</div>
              <div className="fs-4 fw-semibold">₹ {stats.advancesThisMonth.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Total Payout (this month)</div>
              <div className="fs-4 fw-semibold">₹ {stats.totalPayoutThisMonth.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Pending Payslips</div>
              <div className="fs-3 fw-semibold">{stats.pendingPayslips}</div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mt-4 mb-3 fw-semibold">Quick Actions</h5>
      <div className="d-flex gap-2 flex-wrap">
        <button className="btn btn-primary px-4">Create Payslip</button>
        <button className="btn btn-outline-primary px-4">Record Attendance</button>
        <button className="btn btn-outline-primary px-4">Add Advance</button>
        <button className="btn btn-outline-primary px-4">View Employees</button>
      </div>
    </div>
  );
}
