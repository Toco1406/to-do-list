import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginPage from "../pages/AuthPage.jsx";
import TasksPage from "../pages/TasksPage.jsx";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};

const ProtectedRoute = () =>
  isAuthenticated() ? <Outlet /> : <Navigate to="/auth" replace />;

const PublicOnlyRoute = () =>
  isAuthenticated() ? <Navigate to="/tasks" replace /> : <Outlet />;

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: "/auth", element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/tasks", element: <TasksPage /> }],
  },
  { path: "*", element: <Navigate to="/tasks" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;