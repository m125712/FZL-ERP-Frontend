import { lazy } from 'react';

// Pages
const Dashboard = lazy(() => import('@pages/Dashboard'));

export const DashboardRoutes = [
	{
		id: 1,
		path: '/',
		name: 'Dashboard',
		element: <Dashboard />,
		view: 'individual',
		page_name: 'dashboard',
		actions: ['read'],
	},
];
