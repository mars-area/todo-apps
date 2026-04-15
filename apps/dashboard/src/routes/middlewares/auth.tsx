import { Navigate, Outlet as OutletRouterDom } from "react-router";

import AuthLayout from "@/layouts/auth";

import useAuthStore from "@/stores/auth";

const AuthMiddleware = () => {
  const { loggedIn } = useAuthStore();

  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout>
      <OutletRouterDom />
    </AuthLayout>
  );
};

export default AuthMiddleware;
