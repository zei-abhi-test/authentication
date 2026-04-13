import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";   // Your auth context/hook

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // If user is already logged in, don't let them access login/register
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthLayout;