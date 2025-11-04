import { lazy } from 'react';

const Machine = lazy(() => import('@/pages/Maintenance/Machine'));
const Issue = lazy(() => import('@/pages/Maintenance/Issue'));
const Dashboard = lazy(() => import('@/pages/Maintenance/Dashboard'));
const Utility = lazy(() => import('@/pages/Maintenance/Utility'));
const UtilityEntry = lazy(() => import('@/pages/Maintenance/Utility/Entry'));
const UtilityDetails = lazy(
	() => import('@/pages/Maintenance/Utility/Details')
);

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
					'maintain_condition_access',
				],
			},
			{
				name: 'Utility',
				path: '/maintenance/utility',
				element: <Utility />,
				page_name: 'maintenance__utility',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Utility Details',
				path: '/maintenance/utility/:utility_uuid',
				element: <UtilityDetails />,
				hidden: true,
				page_name: 'maintenance__utility_details',
				actions: ['read'],
			},
			{
				name: 'Utility Entry',
				path: '/maintenance/utility/entry',
				element: <UtilityEntry />,
				hidden: true,
				page_name: 'maintenance__utility_entries',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Utility Update',
				path: '/maintenance/utility/:utility_uuid/update',
				element: <UtilityEntry />,
				hidden: true,
				page_name: 'maintenance__utility_update',
				actions: ['create', 'read', 'update'],
			},
		],
	},
];
