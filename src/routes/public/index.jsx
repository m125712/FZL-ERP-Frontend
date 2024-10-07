import { lazy } from 'react';

const Login = lazy(() => import('@pages/Public/Login'));
const NotFound = lazy(() => import('@pages/Public/NoEntry/notFound'));
const NoAccess = lazy(() => import('@pages/Public/NoEntry/noAccess'));

const publicRoutes = [
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/no-access',
		element: <NoAccess />,
	},
	{
		path: '/not-found',
		element: <NotFound />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
];

export default publicRoutes;
