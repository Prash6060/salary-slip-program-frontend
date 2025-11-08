// src/pages/Employees.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function HoverCard({ children, onClick }) {
  const [hover, setHover] = useState(false);

  const style = useMemo(
    () => ({
      cursor: "pointer",
      border: `1px solid ${hover ? "#b6d4fe" : "#e8f1ff"}`,
      background:
        "linear-gradient(180deg, rgba(233,244,255,0.6) 0%, rgba(255,255,255,0.95) 100%)",
      boxShadow: hover
        ? "0 1rem 2rem rgba(13,110,253,0.18)"
        : "0 .6rem 1.2rem rgba(13,110,253,0.10)",
      transform: hover ? "translateY(-2px)" : "translateY(0)",
      transition: "all 160ms ease",
      width: "100%",
      height: "100%",
      borderRadius: "0.75rem",
    }),
    [hover]
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

export default function Employees() {
  const navigate = useNavigate();

  const options = [
    {
      title: "View Employees",
      subtitle: "Browse all employees",
      emoji: "🧑‍💼",
      onClick: () => navigate("/employees/list"),
    },
    {
      title: "Onboard New Employee",
      subtitle: "Add a new team member",
      emoji: "➕",
      onClick: () => navigate("/employees/onboard"),
    },
    {
      title: "Update Wages of Employee",
      subtitle: "Adjust daily pay",
      emoji: "💹",
      onClick: () => navigate("/employees/update-wage"),
    },
    {
      title: "Delete Employee",
      subtitle: "Remove from organization",
      emoji: "🗑️",
      onClick: () => navigate("/employees/delete"),
    },
  ];

  return (
    <div
      className="container-fluid d-flex flex-column"
      style={{ height: "calc(100vh - 56px)", paddingTop: "1rem" }} // 56px ≈ bootstrap navbar height
    >

      {/* Exact full-height 2x2 grid without scroll */}
      <div className="row g-3 flex-grow-1">
        {options.map((opt, i) => (
          <div className="col-6 d-flex" style={{ height: "50%" }} key={i}>
            <HoverCard onClick={opt.onClick}>
              <div className="card-body d-flex flex-column justify-content-center text-center py-5">
                <div className="mb-3">
                  <span
                    aria-hidden
                    style={{
                      fontSize: 40,
                      lineHeight: 1,
                      background: "#e7f1ff",
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "inline-block",
                    }}
                  >
                    {opt.emoji}
                  </span>
                </div>

                {/* Title area with fixed min height to normalize different text lengths */}
                <div
                  style={{ minHeight: 55 }}
                  className="d-flex align-items-center justify-content-center px-3"
                >
                  <div className="fw-semibold fs-4">{opt.title}</div>
                </div>

                <div className="text-muted small">{opt.subtitle}</div>
              </div>
            </HoverCard>
          </div>
        ))}
      </div>
    </div>
  );
}
