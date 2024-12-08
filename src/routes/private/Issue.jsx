import { lazy } from 'react';

const Wastage = lazy(() => import('@pages/Issue/Wastage'));
const OrderIssue = lazy(() => import('@pages/Issue/History'));
const Maintenance = lazy(() => import('@pages/Issue/Maintenance'));
const SpareParts = lazy(() => import('@pages/Issue/SpareParts'));

export const IssueRoutes = [
	{
		name: 'Issue',
		children: [
			{
				name: 'History',
				path: '/issue/history',
				element: <OrderIssue />,
			},
			{
				name: 'Maintenance',
				path: '/issue/maintenance',
				element: <Maintenance />,
			},
			{
				name: 'Spare Parts',
				path: '/issue/spare-parts',
				element: <SpareParts />,
			},
			{
				name: 'Wastage',
				path: '/issue/wastage',
				element: <Wastage />,
			},
		],
	},
];
