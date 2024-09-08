import { About, Contact, Home } from '@/test/pages';

const publicRoutes = [
	{
		path: '/',
		name: 'Home',
		element: Home,
	},
	{
		path: '/about',
		name: 'About',
		element: About,
	},
	{
		path: '/contact',
		name: 'Contact',
		element: Contact,
	},
];

export default publicRoutes;
