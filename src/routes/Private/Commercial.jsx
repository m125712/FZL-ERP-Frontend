// PI
import PI from '@pages/Commercial/PI';
import PiDetails from '@pages/Commercial/PI/Details';
import PiEntry from '@pages/Commercial/PI/Entry';

// Bank
import Bank from '@pages/Commercial/Bank';

// LC
import LC from '@pages/Commercial/LC';
import LCDetails from '@pages/Commercial/LC/Details';
import LCEntry from '@pages/Commercial/LC/Entry';

export const CommercialRoutes = [
	{
		name: 'Commercial',
		children: [
			{
				name: 'LC',
				path: '/commercial/lc',
				element: <LC />,
				page_name: 'commercial__lc',
				actions: ['create', 'read', 'update', 'delete'],
				disableCollapse: true,

				children: [
					{
						name: 'LC Details',
						path: '/commercial/lc/details/:lc_number',
						element: <LCDetails />,
						page_name: 'commercial__lc_details',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},

					{
						name: 'LC Entry',
						path: '/commercial/lc/entry',
						element: <LCEntry />,
						page_name: 'commercial__lc_entry',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},
					{
						id: 3,
						name: 'PI Update',
						path: '/commercial/lc/:lc_uuid/update',
						element: <LCEntry />,
						page_name: 'commercial__lc_update',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},
				],
			},

			{
				name: 'PI',
				path: '/commercial/pi',
				element: <PI />,
				page_name: 'commercial__pi',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
				disableCollapse: true,
				children: [
					{
						name: 'PI',
						path: '/commercial/pi/details/:pi_id',
						element: <PiDetails />,
						page_name: 'commercial__pi_details',
						actions: [
							'create',
							'read',
							'update',
							'delete',
							'click_receive_status',
						],
						hidden: true,
					},
					{
						name: 'PI Entry',
						path: '/commercial/pi/entry',
						element: <PiEntry />,
						page_name: 'commercial__pi_entry',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},
					{
						name: 'PI Update',
						path: '/commercial/pi/:pi_uuid/update',
						element: <PiEntry />,
						page_name: 'commercial__pi_update',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},
				],
			},

			{
				name: 'Bank',
				path: '/commercial/bank',
				element: <Bank />,
				page_name: 'commercial__bank',
				actions: ['create', 'read', 'update', 'delete'],
			},
		],
	},
];
