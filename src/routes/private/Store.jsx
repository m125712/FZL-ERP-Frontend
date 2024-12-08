import { lazy } from 'react';

const MaterialLog = lazy(() => import('@/pages/Store/Log'));
const Purchase = lazy(() => import('@/pages/Store/Receive'));
const PurchaseInd = lazy(
	() => import('@/pages/Store/Receive/Details/ByPurchaseDescriptionUUID')
);
const PurchaseEntry = lazy(() => import('@/pages/Store/Receive/Entry'));
const Section = lazy(() => import('@/pages/Store/Section'));
const Stock = lazy(() => import('@/pages/Store/Stock'));
const Test = lazy(() => import('@/pages/Store/Test'));
const MaterialType = lazy(() => import('@/pages/Store/Type'));
// * Purchase
const Vendor = lazy(() => import('@/pages/Store/Vendor'));

export const StoreRoutes = [
	{
		name: 'Store',
		children: [
			{
				name: 'Stock',
				path: '/store/stock',
				element: <Stock />,
				page_name: 'store__stock',
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
				path: '/store/receive',
				element: <Purchase />,
				page_name: 'store__receive',
				actions: ['create', 'read', 'update'],
				disableCollapse: true,
				children: [
					{
						name: 'Details',
						path: '/store/receive/:purchase_description_uuid',
						element: <PurchaseInd />,
						hidden: true,
						page_name: 'store__receive_by_uuid',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store/receive/entry',
						element: <PurchaseEntry />,
						hidden: true,
						page_name: 'store__receive_entry',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store/receive/:purchase_description_uuid/update',
						element: <PurchaseEntry />,
						hidden: true,
						page_name: 'store__receive_update',
						actions: ['create', 'read', 'update'],
					},
				],
			},
			{
				name: 'Section',
				path: '/store/section',
				element: <Section />,
				page_name: 'store__section',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Type',
				path: '/store/type',
				element: <MaterialType />,
				page_name: 'store__type',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Vendor',
				path: '/store/vendor',
				element: <Vendor />,
				page_name: 'store__vendor',
				actions: ['create', 'read', 'update', 'delete'],
			},

			{
				name: 'Log',
				path: '/store/log',
				element: <MaterialLog />,
				page_name: 'store__log',
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
			{
				name: 'Test',
				path: '/store/test',
				element: <Test />,
				page_name: 'store__test',
				actions: ['read'],
			},
		],
	},
];
