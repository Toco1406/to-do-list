import React from "react";
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import LoginPage from "../pages/AuthPage.jsx";
import TasksPage from "../pages/TasksPage.jsx";

const API = "http://localhost:3000"

const checkAuth = async () => {
  try {
    const res = await fetch(`${API}/auth/me`, { credentials: "include" });
    return res.ok;
  } catch {
    return false;
  }
};

const protectedLoader = async () => ((await checkAuth()) ? null : redirect("/auth"));
const publicOnlyLoader = async () => ((await checkAuth()) ? redirect("/tasks") : null);

const router = createBrowserRouter([
  { path: "/auth", loader: publicOnlyLoader, element: <LoginPage /> },
  { path: "/tasks", loader: protectedLoader, element: <TasksPage /> },
  { path: "*", loader: () => redirect("/tasks") },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;