import Login from '@/pages/Public/Login';
import NoAccess from '@/pages/Public/NoEntry/noAccess';
import NotFound from '@/pages/Public/NoEntry/notFound';
import { createBrowserRouter } from 'react-router';

import Layout from '@/components/layout';

import { flatRoutes } from '.';

const routes = [
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
	{
		element: <Layout />,
		children: flatRoutes,
	},
];

export const router = createBrowserRouter(routes);
