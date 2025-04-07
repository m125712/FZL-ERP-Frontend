import Profile from '@/pages/Profile';

export const ProfileRoutes = [
	{
		name: 'Profile',
		path: '/profile',
		element: <Profile />,
		page_name: 'profile',
		actions: ['read', 'update', 'reset_password'],
	},
];
