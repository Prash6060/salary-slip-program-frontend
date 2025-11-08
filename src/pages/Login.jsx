import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import heroImg from "../images/login_hero.jpg";

export default function Login() {
  const navigate = useNavigate();

  // form state
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // if already logged in (token in localStorage), redirect user
  useEffect(() => {
    const hasToken = !!localStorage.getItem("token");
    if (hasToken) navigate("/dashboard"); // change path if your dashboard differs
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!adminId.trim() || !adminPassword.trim()) {
      setErrorMsg("Please enter Admin ID and Admin Password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies set by the server
        body: JSON.stringify({ adminId, adminPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // backend should send { message: '...' }
        throw new Error(data?.message || "Login failed. Please try again.");
      }

      // Save token if backend returns it (it also sets cookie when configured)
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // OPTIONAL: store adminId for quick header display
      if (data?.adminId) {
        localStorage.setItem("adminId", data.adminId);
      }

      // redirect to dashboard
      navigate("/dashboard"); // adjust route as needed
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* LEFT PANEL IMAGE */}
          <div className="col-lg-6 d-none d-lg-block p-0">
            <div
              className="login-hero h-100 w-100"
              style={{ backgroundImage: `url(${heroImg})` }}
            >
              <div className="login-hero-overlay">
                <h2 className="fw-semibold mb-1 text-white">Welcome back</h2>
                <p className="mb-0 text-white">Salary Slip HR Management System</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL LOGIN */}
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
            <div className="login-card card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="brand-badge mx-auto mb-2">GG</div>
                  <h1 className="h4 mb-0">Login Page</h1>
                </div>

                {/* Error alert */}
                {errorMsg && (
                  <div className="alert alert-danger py-2" role="alert">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                  <div className={`form-floating mb-3 animated-field ${adminId ? "has-value" : ""}`}>
                    <input
                      id="adminId"
                      className="form-control"
                      placeholder="Admin ID"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      disabled={loading}
                      autoComplete="username"
                      required
                    />
                    <label htmlFor="adminId">Admin ID</label>
                  </div>

                  <div className={`form-floating mb-4 animated-field ${adminPassword ? "has-value" : ""}`}>
                    <input
                      id="adminPassword"
                      type="password"
                      className="form-control"
                      placeholder="Admin Password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                      required
                    />
                    <label htmlFor="adminPassword">Admin Password</label>
                  </div>

                  <button className="btn btn-primary w-100 py-2" disabled={loading}>
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </form>

                <div className="text-center small text-muted mt-3">
                  © {new Date().getFullYear()} Salary Manager
                </div>
              </div>
            </div>
          </div>
          {/* /RIGHT */}
        </div>
      </div>
    </div>
  );
}
