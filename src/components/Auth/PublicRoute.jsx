import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return children;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 > Date.now()) {
      return <Navigate to="/admin-dashboard" replace />;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return children;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return children;
  }
};

export default PublicRoute;