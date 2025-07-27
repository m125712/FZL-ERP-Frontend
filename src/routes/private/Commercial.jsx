import { lazy } from 'react';

const Dashboard = lazy(() => import('@pages/Commercial/Dashboard'));
const Log = lazy(() => import('@pages/Commercial/Log'));
const Bank = lazy(() => import('@pages/Commercial/Bank'));
const PiCash = lazy(() => import('@pages/Commercial/Cash'));
const PiCashDetails = lazy(() => import('@pages/Commercial/Cash/Details'));
const PiCashEntry = lazy(() => import('@pages/Commercial/Cash/Entry'));
const LC = lazy(() => import('@pages/Commercial/LC'));
const LCDetails = lazy(() => import('@pages/Commercial/LC/Details'));
const LCEntry = lazy(() => import('@pages/Commercial/LC/Entry'));
const ManualPI = lazy(() => import('@pages/Commercial/ManualPI'));
const ManualPIDetails = lazy(
	() => import('@pages/Commercial/ManualPI/Details')
);
const ManualPIEntry = lazy(() => import('@pages/Commercial/ManualPI/Entry'));
const PI = lazy(() => import('@pages/Commercial/PI'));
const PiDetails = lazy(() => import('@pages/Commercial/PI/Details'));
const PiEntry = lazy(() => import('@pages/Commercial/PI/Entry'));

export const CommercialRoutes = [
	{
		name: 'Commercial',
		children: [
			{
				name: 'Dashboard',
				path: '/commercial/dashboard',
				element: <Dashboard />,
				page_name: 'commercial__dashboard',
				actions: ['read'],
			},
			{
				name: 'Letter of Credit (LC)',
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
						actions: [
							'create',
							'read',
							'update',
							'delete',
							'edit_document_progression',
							'edit_bank_payment_progression',
						],
						hidden: true,
					},
					{
						id: 3,
						name: 'LC Update',
						path: '/commercial/lc/:lc_uuid/update',
						element: <LCEntry />,
						page_name: 'commercial__lc_update',
						actions: [
							'create',
							'read',
							'update',
							'delete',
							'edit_document_progression',
							'edit_bank_payment_progression',
						],
						hidden: true,
					},
				],
			},

			{
				name: 'Proforma Invoice (PI)',
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
					'input_manual_lc_pi_access',
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
				name: 'Manual Proforma Invoice',
				path: '/commercial/manual-pi',
				element: <ManualPI />,
				page_name: 'commercial__manual_pi',
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
						name: 'PI',
						path: '/commercial/manual-pi/:manual_pi_uuid',
						element: <ManualPIDetails />,
						page_name: 'commercial__manual_pi_details',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},
					{
						name: 'Manual PI Entry',
						path: '/commercial/manual-pi/entry',
						element: <ManualPIEntry />,
						page_name: 'commercial__manual_pi_entry',
						actions: ['create', 'read', 'update', 'delete'],
						hidden: true,
					},
					{
						name: 'Manual PI Update',
						path: '/commercial/manual-pi/:manual_pi_uuid/update',
						element: <ManualPIEntry />,
						page_name: 'commercial__manual_pi_update',
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
					'click_receive_amount',
					'click_status_complete',
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
			{
				name: 'Log',
				path: '/commercial/log',
				element: <Log />,
				page_name: 'commercial__log',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_amount_update',
					'click_receive_amount_delete',
				],
			},
		],
	},
];
