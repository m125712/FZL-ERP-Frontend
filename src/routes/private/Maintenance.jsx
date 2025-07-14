import { lazy } from 'react';

const Machine = lazy(() => import('@/pages/Maintenance/Machine'));

export const MaintenanceRoutes = [
	{
		name: 'Maintenance',
		children: [
			{
				name: 'Section-Machine',
				path: '/maintenance/section-machine',
				element: <Machine />,
				page_name: 'maintenance__section_machine',
				actions: ['create', 'read', 'update', 'delete', 'click_status'],
			},
		],
	},
];
