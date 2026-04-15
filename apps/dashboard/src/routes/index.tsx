import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import AuthMiddleware from "./middlewares/auth";
import PrivateMiddleware from "./middlewares/private";

const SignInPage = lazy(() => import("@/pages/sign-in"));
const RegisterPage = lazy(() => import("@/pages/register"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthMiddleware />}>
          <Route path="/" element={<SignInPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<PrivateMiddleware />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<div>not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
