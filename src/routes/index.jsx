import Sidebar from "@/components/Sidebar";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { FilteredRoutes, PRIVATE_ROUTES } from "./Private";
import ProtectedRoutes from "./Private/ProtectedRoutes";
import { PUBLIC_ROUTES } from "./Public";

const Login = lazy(() => import("@pages/Public/Login"));
const NotFound = lazy(() => import("@pages/Public/NoEntry/notFound"));
const NoAccess = lazy(() => import("@pages/Public/NoEntry/noAccess"));

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
	},
	{
		element: <ProtectedRoutes />,
		children: [
			{
				path: "/no-access",
				element: <NoAccess />,
			},
			{
				path: "/not-found",
				element: <NotFound />,
			},
			{
				path: "*",
				element: <NotFound />,
			},
			{
				element: <Sidebar />,
				children: [
					...FilteredRoutes()?.map((route) => ({
						...route,
						element: <route.element />,
					})),
				],
			},
		],
	},
]);

export { FilteredRoutes, PRIVATE_ROUTES, ProtectedRoutes, PUBLIC_ROUTES };
