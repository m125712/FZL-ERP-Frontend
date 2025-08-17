import { lazy } from 'react';

const MaterialLog = lazy(() => import('@/pages/Store/Accessories/Log'));
const Receive = lazy(() => import('@/pages/Store/Accessories/Receive'));
const ReceiveDetails = lazy(
	() => import('@/pages/Store/_components/Receive/Details')
);
const ReceiveEntry = lazy(
	() => import('@/pages/Store/_components/Receive/Entry')
);

const Section = lazy(() => import('@/pages/Store/Accessories/section'));
const Stock = lazy(() => import('@/pages/Store/Accessories/stock'));
const MaterialType = lazy(() => import('@/pages/Store/Accessories/Type'));

const Vendor = lazy(() => import('@/pages/Store/Accessories/Vendor'));

export const StoreAccessoriesRoutes = [
	{
		name: 'Store (Accessories)',
		children: [
			{
				name: 'Stock',
				path: '/store-accessories/stock',
				element: <Stock />,
				page_name: 'store_accessories__stock',
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
				path: '/store-accessories/receive',
				element: <Receive />,
				page_name: 'store_accessories__receive',
				actions: ['create', 'read', 'update', 'delete'],
				disableCollapse: true,
				children: [
					{
						name: 'Details',
						path: '/store-accessories/receive/:purchase_description_uuid',
						element: <ReceiveDetails />,
						hidden: true,
						page_name: 'store_accessories__receive_details',
						actions: ['read'],
					},
					{
						name: 'Entry',
						path: '/store-accessories/receive/entry',
						element: <ReceiveEntry />,
						hidden: true,
						page_name: 'store_accessories__receive_entry',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store-accessories/receive/:purchase_description_uuid/update',
						element: <ReceiveEntry />,
						hidden: true,
						page_name: 'store_accessories__receive_update',
						actions: ['create', 'read', 'update'],
					},
				],
			},
			{
				name: 'Section',
				path: '/store-accessories/section',
				element: <Section />,
				page_name: 'store_accessories__section',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Material Type',
				path: '/store-accessories/type',
				element: <MaterialType />,
				page_name: 'store_accessories__type',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Vendor',
				path: '/store-accessories/vendor',
				element: <Vendor />,
				page_name: 'store_accessories__vendor',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Log',
				path: '/store-accessories/log',
				element: <MaterialLog />,
				page_name: 'store_accessories__log',
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
