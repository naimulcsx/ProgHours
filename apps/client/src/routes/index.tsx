import { ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import SignInPage from "~/pages/auth/sign-in.page";
import SignUpPage from "~/pages/auth/sign-up.page";
import HomePage from "~/pages/index.page";
import OverviewPage from "~/pages/overview.page";
import SubmissionsPage from "~/pages/submissions.page";

const defineRoute = (path: string, element: ReactNode) => ({ path, element });

export const getRoutes = (isLoggedIn: boolean): RouteObject[] => [
  defineRoute("/", isLoggedIn ? <Navigate to="/overview" /> : <HomePage />),
  defineRoute(
    "/overview",
    isLoggedIn ? <OverviewPage /> : <Navigate to="/auth/sign-in" />
  ),
  defineRoute(
    "/submissions",
    isLoggedIn ? <SubmissionsPage /> : <Navigate to="/auth/sign-in" />
  ),
  defineRoute(
    "/auth/sign-up",
    isLoggedIn ? <Navigate to="/" /> : <SignUpPage />
  ),
  defineRoute(
    "/auth/sign-in",
    isLoggedIn ? <Navigate to="/" /> : <SignInPage />
  )
];