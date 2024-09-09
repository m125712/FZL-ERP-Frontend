import { lazy } from 'react';

// Pages
const Dashboard = lazy(() => import('@pages/Dashboard'));

export const DashboardRoutes = [
	{
		id: 1,
		path: '/dashboard',
		name: 'Dashboard',
		element: Dashboard,
		type: 'dashboard',
		view: 'individual',
		page_name: 'dashboard',
		actions: ['read'],
	},
];
