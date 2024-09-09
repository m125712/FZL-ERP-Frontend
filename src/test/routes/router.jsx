import { createBrowserRouter } from 'react-router-dom';
import { flatRoutes } from './routes';
import Layout from '../layout';
import publicRoutes from './public';

export const router = createBrowserRouter([
	...publicRoutes,
	{
		element: <Layout />,
		children: flatRoutes.map((route) => {
			return {
				path: route.path,
				element: <route.element />,
			};
		}),
	},
]);
