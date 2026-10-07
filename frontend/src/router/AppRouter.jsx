import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home.jsx";
import LoginPage from "../pages/AuthPage.jsx";
import TasksPage from "../pages/TasksPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "/auth",
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/tasks",
    children: [{ index: true, element: <TasksPage /> }],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
