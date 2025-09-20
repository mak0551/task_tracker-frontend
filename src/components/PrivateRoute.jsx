import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();
  console.log("PrivateRoute token:", token); // Debugging line
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
