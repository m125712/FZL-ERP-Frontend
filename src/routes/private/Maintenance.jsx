import { lazy } from 'react';

const Machine = lazy(() => import('@/pages/Maintenance/Machine'));
const Issue = lazy(() => import('@/pages/Maintenance/Issue'));
const Dashboard = lazy(() => import('@/pages/Maintenance/Dashboard'));

export const MaintenanceRoutes = [
	{
		name: 'Maintenance',
		children: [
			{
				name: 'Dashboard',
				path: '/maintenance/dashboard',
				element: <Dashboard />,
				page_name: 'maintenance__dashboard',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Section-Machine',
				path: '/maintenance/section-machine',
				element: <Machine />,
				page_name: 'maintenance__section_machine',
				actions: ['create', 'read', 'update', 'delete', 'click_status'],
			},

			{
				name: 'Issue',
				path: '/maintenance/issue',
				element: <Issue />,
				page_name: 'maintenance__issue',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'notification',
					'unsubscribe',
					'verification',
					'procurement',
					'show_own_issue',
					'override',
				],
			},
		],
	},
];
