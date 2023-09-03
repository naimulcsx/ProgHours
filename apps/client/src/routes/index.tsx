import { ReactNode } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import SignInPage from "~/pages/auth/sign-in.page";
import SignUpPage from "~/pages/auth/sign-up.page";
import OverviewPage from "~/pages/dashboard/overview.page";

import HomePage from "~/pages/index.page";
import LeaderboardPage from "~/pages/leaderboard.page";

const defineRoute = (path: string, element: ReactNode) => ({ path, element });

export const getRoutes = (isLoggedIn: boolean): RouteObject[] => [
  defineRoute("/", isLoggedIn ? <HomePage /> : <HomePage />),
  defineRoute(
    "/leaderboard",
    isLoggedIn ? <LeaderboardPage /> : <LeaderboardPage />
  ),
  defineRoute(
    "/auth/sign-in",
    isLoggedIn ? <Navigate to="/" /> : <SignInPage />
  ),
  defineRoute(
    "/auth/sign-up",
    isLoggedIn ? <Navigate to="/" /> : <SignUpPage />
  ),
  defineRoute("/overview", isLoggedIn ? <OverviewPage /> : <OverviewPage />)
];
