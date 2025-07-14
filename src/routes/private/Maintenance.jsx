import { lazy } from 'react';

const Machine = lazy(() => import('@/pages/Maintenance/Machine'));

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
		],
	},
];
