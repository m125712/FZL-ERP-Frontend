import { createBrowserRouter, Outlet } from 'react-router-dom';
import Layout from '../layout';
import publicRoutes from './public';
import { flatRoutes, routes } from './routes';

export const router = createBrowserRouter([
	...publicRoutes,
	{
		element: <Layout />,
		children: flatRoutes,
		// children: routes,
		// children: [
		// 	{
		// 		path: '/store',
		// 		element: <Outlet />,
		// 		children: [
		// 			{
		// 				index: true,
		// 				element: <div>Store</div>,
		// 			},
		// 			{
		// 				path: 'stock',
		// 				element: <div>Stock 123</div>,
		// 			},
		// 		],
		// 	},
		// ],
	},
]);
