import { lazy } from 'react';

// Hr
// const User = lazy(() => import('@pages/Admin/User'));
// const Department = lazy(() => import('@pages/Admin/Department'));
// const Designation = lazy(() => import('@pages/Admin/Designation'));

// * New
import Department from '@/pages/Admin/Department';
import Designation from '@/pages/Admin/Designation';
import User from '@/pages/Admin/User';

export const HrRoutes = [
	{
		name: 'HR',
		path: '/hr',
		element: <User />,
		children: [
			{
				id: 1,
				name: 'User',
				path: '/hr/user',
				element: <User />,
				type: 'hr',
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
				id: 11,
				name: 'Designation',
				path: '/hr/designation',
				element: <Designation />,
				type: 'hr',
				page_name: 'admin__user_designation',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				id: 11,
				name: 'Department',
				path: '/hr/department',
				element: <Department />,
				type: 'hr',
				page_name: 'admin__user_department',
				actions: ['create', 'read', 'update', 'delete'],
			},
		],
	},
];
