import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout';
import publicRoutes from './public';
import { flatRoutes } from './routes';

export const router = createBrowserRouter([
	...publicRoutes,
	{
		element: <Layout />,
		children: flatRoutes,
	},
]);
