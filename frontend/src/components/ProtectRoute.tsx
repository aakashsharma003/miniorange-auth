import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProtectedRedirect({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token && location.pathname !== "/profile") {
      navigate("/profile", { replace: true });
    }
  }, [token, navigate, location]);

  return <>{children}</>;
}