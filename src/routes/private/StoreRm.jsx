import { lazy } from 'react';

const MaterialLog = lazy(() => import('@/pages/Store/Rm/Log'));
const Receive = lazy(() => import('@/pages/Store/Rm/Receive'));
const ReceiveDetails = lazy(
	() => import('@/pages/Store/_components/Receive/Details')
);
const ReceiveEntry = lazy(
	() => import('@/pages/Store/_components/Receive/Entry')
);

const Section = lazy(() => import('@/pages/Store/Rm/section'));
const Stock = lazy(() => import('@/pages/Store/Rm/stock'));
const MaterialType = lazy(() => import('@/pages/Store/Rm/Type'));

const Vendor = lazy(() => import('@/pages/Store/Rm/Vendor'));

export const StoreRmRoutes = [
	{
		name: 'Store (Rm)',
		children: [
			{
				name: 'Stock',
				path: '/store-rm/stock',
				element: <Stock />,
				page_name: 'store_rm__stock',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_trx_against_order',
					'click_action',
					'click_booking',
				],
			},
			{
				name: 'Receive',
				path: '/store-rm/receive',
				element: <Receive />,
				page_name: 'store_rm__receive',
				actions: ['create', 'read', 'update', 'delete'],
				disableCollapse: true,
				children: [
					{
						name: 'Details',
						path: '/store-rm/receive/:purchase_description_uuid',
						element: <ReceiveDetails />,
						hidden: true,
						page_name: 'store_rm__receive_details',
						actions: ['read'],
					},
					{
						name: 'Entry',
						path: '/store-rm/receive/entry',
						element: <ReceiveEntry />,
						hidden: true,
						page_name: 'store_rm__receive_entry',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store-rm/receive/:purchase_description_uuid/update',
						element: <ReceiveEntry />,
						hidden: true,
						page_name: 'store_rm__receive_update',
						actions: ['create', 'read', 'update'],
					},
				],
			},
			{
				name: 'Section',
				path: '/store-rm/section',
				element: <Section />,
				page_name: 'store_rm__section',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Material Type',
				path: '/store-rm/type',
				element: <MaterialType />,
				page_name: 'store_rm__type',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Vendor',
				path: '/store-rm/vendor',
				element: <Vendor />,
				page_name: 'store_rm__vendor',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Log',
				path: '/store-rm/log',
				element: <MaterialLog />,
				page_name: 'store_rm__log',
				actions: [
					'read',
					'update_log',
					'delete_log',
					'update_log_against_order',
					'delete_log_against_order',
					'update_booking',
					'delete_booking',
					'click_trx_against_order',
					'click_action',
				],
			},
		],
	},
];
