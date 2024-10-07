import Department from '@/pages/Admin/Department';
import Designation from '@/pages/Admin/Designation';
import User from '@/pages/Admin/User';

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
		],
	},
];
