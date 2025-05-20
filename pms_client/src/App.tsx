import React, { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthLayout from "./layouts/authLayout";
import DashboardLayout from "./layouts/dashboardLayout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import DashboardPage from "./pages/dashboard";
import ForgotPasswordPage from "./pages/auth/forgotPassword";
import ResetPasswordPage from "./pages/auth/resetPassword";
import NotFoundPage from "./pages/404";
import UnauthorizedPage from "./pages/404/unauthorized";
import UserPage from "./pages/users";
import RequestPage from "./pages/requests";
import SlotsPage from "./pages/slots";
import VehiclePage from "./pages/vehicles";
import { useAuth } from "./contexts/AuthContext";

const PrivateRoute: React.FC<{
  children: ReactElement;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-green-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.includes(user.role)) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

const PublicRoute: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-green-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return token && user ? <Navigate to="/dashboard/overview" replace /> : children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="resetPassword" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="overview"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="vehicles"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <VehiclePage />
              </PrivateRoute>
            }
          />
          <Route
            path="slots"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <SlotsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="requests"
            element={
              <PrivateRoute allowedRoles={["ADMIN", "USER"]}>
                <RequestPage />
              </PrivateRoute>
            }
          />
          <Route
            path="users"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <UserPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
        </Route>

        {/* Root route */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Error routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
