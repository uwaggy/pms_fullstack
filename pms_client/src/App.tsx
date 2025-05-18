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

const PrivateRoute: React.FC<{
  children: ReactElement;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/auth/register" replace />;
  }

  try {
    const parsedUser = JSON.parse(user);
    const UserRole = parsedUser.role;

    if (allowedRoles.includes(UserRole)) {
      return children;
    } else {
      return <Navigate to="/dashboard/vehicles" replace />;
    }
  } catch {
    return <Navigate to="/auth/register" replace />;
  }
};

const PublicRoute: React.FC<{ children: ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard/overview" replace /> : children;
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
          <Route path="*" element={<Navigate to="/auth/register" replace />} />
        </Route>

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
              <PrivateRoute allowedRoles={["ADMIN","USER"]}>
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
          <Route path="unauthorized" element={<UnauthorizedPage />} />
        </Route>
        <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
