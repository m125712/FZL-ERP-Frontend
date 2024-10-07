// Issue
import Wastage from '@/pages/Issue/Wastage';
import OrderIssue from '@/pages/Issue/History';
import Maintenance from '@/pages/Issue/Maintenance';
import SpareParts from '@/pages/Issue/SpareParts';

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
