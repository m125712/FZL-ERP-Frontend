import { lazy } from 'react';

const User = lazy(() => import('@pages/Library/User'));
const Policy = lazy(() => import('@pages/Library/Policy'));

export const LibraryRoutes = [
	{
		name: 'Library',
		children: [
			{
				name: 'Users',
				path: '/library/users',
				element: <User />,
				page_name: 'library__users',
				actions: ['read'],
			},
			{
				name: 'Policy',
				path: '/library/policy',
				element: <Policy />,
				page_name: 'library__policy',
				actions: ['create', 'read', 'update', 'delete', 'click_status'],
			},
		],
	},
];
