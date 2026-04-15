import { Navigate, Outlet as OutletRouterDom, useLocation } from "react-router";

import MainLayout from "@/layouts/main";

import useAuthStore from "@/stores/auth";

const PrivateMiddleware = () => {
  const location = useLocation();

  const { loggedIn } = useAuthStore();

  if (!loggedIn) return <Navigate to={"/sign-in"} state={{ from: location }} replace />;

  return (
    <MainLayout>
      <OutletRouterDom />
    </MainLayout>
  );
};

export default PrivateMiddleware;
