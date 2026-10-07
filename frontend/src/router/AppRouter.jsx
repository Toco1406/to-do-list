import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home.jsx";
import LoginPage from "../pages/loginPage.jsx";
import RegisterPage from "../pages/registerPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
    ],
  },
    {
    path: "/login",
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
      {
    path: "/register",
    children: [
      { index: true, element: <RegisterPage /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;