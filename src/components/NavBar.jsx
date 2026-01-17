// src/components/NavBar.jsx
import { useNavigate, Outlet } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-semibold" style={{ letterSpacing: ".3px" }}
          onClick={() => navigate("/")}>
            Salary Manager
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <button className="btn nav-link text-white" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </button>
              </li>

              <li className="nav-item">
                <button className="btn nav-link text-white" onClick={() => navigate("/employees")}>
                  Employees
                </button>
              </li>

              <li className="nav-item">
                <button className="btn nav-link text-white" onClick={() => navigate("/attendance")}>
                  Attendance
                </button>
              </li>

              <li className="nav-item">
                <button className="btn nav-link text-white" onClick={() => navigate("/payslips")}>
                  Payslips
                </button>
              </li>

              <li className="nav-item">
                <button className="btn nav-link text-white" onClick={() => navigate("/advances")}>
                  Advances
                </button>
              </li>

              <li className="nav-item">
                <button className="btn nav-link text-white" onClick={() => navigate("/analytics")}>
                  Analytics
                </button>
              </li>

            </ul>

            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
