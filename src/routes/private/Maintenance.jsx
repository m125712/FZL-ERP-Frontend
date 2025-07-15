import { lazy } from 'react';

const Machine = lazy(() => import('@/pages/Maintenance/Machine'));
const Issue = lazy(() => import('@/pages/Maintenance/Issue'));

export const MaintenanceRoutes = [
	{
		name: 'Maintenance',
		children: [
			{
				name: 'Machine',
				path: '/maintenance/machine',
				element: <Machine />,
				page_name: 'maintenance__machine',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Issue',
				path: '/maintenance/issue',
				element: <Issue />,
				page_name: 'maintenance__issue',
				actions: ['create', 'read', 'update', 'delete'],
			},
		],
	},
];
