import { createBrowserRouter } from 'react-router-dom';

import publicRoutes from './public';
import { flatRoutes } from '.';
import Layout from '@/components/layout';

export const router = createBrowserRouter([
	...publicRoutes,
	{
		element: <Layout />,
		children: flatRoutes,
	},
]);
