import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/components/layout';

import { filteredRoutes } from '.';
import publicRoutes from './public';

export const router = createBrowserRouter([
	...publicRoutes,
	{
		element: <Layout />,
		children: filteredRoutes,
	},
]);
