// PI

// Bank
import Bank from '@pages/Commercial/Bank';
import PiCash from '@pages/Commercial/Cash';
import PiCashDetails from '@pages/Commercial/Cash/Details';
import PiCashEntry from '@pages/Commercial/Cash/Entry';
// LC
import LC from '@pages/Commercial/LC';
import LCDetails from '@pages/Commercial/LC/Details';
import LCEntry from '@pages/Commercial/LC/Entry';
import PI from '@pages/Commercial/PI';
import PiDetails from '@pages/Commercial/PI/Details';
import PiEntry from '@pages/Commercial/PI/Entry';

export const CommercialRoutes = [
	{
		name: 'Commercial',
		children: [
			{
				name: 'LC',
				path: '/commercial/lc',
				element: <LC />,
				page_name: 'commercial__lc',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'show_own_orders',
				],
				disableCollapse: true,

				children: [
					{
						name: 'LC Details',
						path: '/commercial/lc/details/:lc_number',
						element: <LCDetails />,
						page_name: 'commercial__lc_details',
						actions: [
							'create',
							'read',
							'update',
							'delete',
							'show_own_orders',
						],
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
					'show_own_orders',
				],
				disableCollapse: true,
				children: [
					{
						name: 'PI',
						path: '/commercial/pi/:pi_id',
						element: <PiDetails />,
						page_name: 'commercial__pi_details',
						actions: [
							'create',
							'read',
							'update',
							'delete',
							'click_receive_status',
							'show_own_orders',
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
				name: 'Cash Invoice',
				path: '/commercial/pi-cash',
				element: <PiCash />,
				page_name: 'commercial__pi-cash',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
					'show_own_orders',
				],
				disableCollapse: true,
				children: [
					{
						name: 'PI',
						path: '/commercial/pi-cash/:pi_id',
						element: <PiCashDetails />,
						page_name: 'commercial__pi_cash_details',
						actions: [
							'create',
							'read',
							'update',
							'delete',
							'click_receive_status',
							'show_own_orders',
						],
						hidden: true,
					},
					{
						name: 'Cash Entry',
						path: '/commercial/pi-cash/entry',
						element: <PiCashEntry />,
						page_name: 'commercial__pi_cash_entry',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},
					{
						name: 'Cash Update',
						path: '/commercial/pi-cash/:pi_uuid/update',
						element: <PiCashEntry />,
						page_name: 'commercial__pi_cash_update',
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
