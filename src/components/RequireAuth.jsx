import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // hit backend me API → if cookie token valid returns ok
        const res = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (res.ok) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch (err) {
        setAllowed(false);
      }
      setChecking(false);
    })();
  }, []);

  if (checking) return <div className="container py-5">Checking session...</div>;

  return allowed ? <Outlet /> : <Navigate to="/" replace />;
}
