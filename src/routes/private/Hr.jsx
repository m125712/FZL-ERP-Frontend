import { lazy } from 'react';

const Department = lazy(() => import('@/pages/Admin/Department'));
const Designation = lazy(() => import('@/pages/Admin/Designation'));
const User = lazy(() => import('@/pages/Admin/User'));
const Permissions = lazy(() => import('@/pages/Admin/Permissions'));

export const HrRoutes = [
	{
		name: 'HR',
		children: [
			{
				name: 'User',
				path: '/hr/user',
				element: <User />,
				page_name: 'admin__user',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_status',
					'click_reset_password',
					'click_page_assign',
				],
			},

			{
				name: 'Designation',
				path: '/hr/designation',
				element: <Designation />,
				page_name: 'admin__user_designation',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Department',
				path: '/hr/department',
				element: <Department />,
				page_name: 'admin__user_department',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Permissions',
				path: '/hr/permissions',
				element: <Permissions />,
				page_name: 'admin__user_permissions',
				actions: ['create', 'read', 'update', 'delete'],
			},
		],
	},
];
