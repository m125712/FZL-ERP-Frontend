import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout';
import publicRoutes from './public';
import { flatRoutes } from '.';

export const router = createBrowserRouter([
	...publicRoutes,
	{
		element: <Layout />,
		children: flatRoutes,
	},
]);
