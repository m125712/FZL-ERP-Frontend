import { lazy } from 'react';

const MaterialLog = lazy(() => import('@/pages/StoreMaintenance/Log'));
const Purchase = lazy(() => import('@/pages/StoreMaintenance/Receive'));
const PurchaseInd = lazy(
	() =>
		import(
			'@/pages/StoreMaintenance/Receive/Details/ByPurchaseDescriptionUUID'
		)
);
const PurchaseEntry = lazy(
	() => import('@/pages/StoreMaintenance/Receive/Entry')
);

const Section = lazy(() => import('@/pages/StoreMaintenance/Section'));
const StockRm = lazy(() => import('@/pages/StoreMaintenance/Stock'));
const MaterialType = lazy(() => import('@/pages/StoreMaintenance/Type'));
// * Purchase
const Vendor = lazy(() => import('@/pages/StoreMaintenance/Vendor'));

export const StoreMaintenanceRoutes = [
	{
		name: 'Store (Maintenance)',
		children: [
			{
				name: 'Stock (Maintenance)',
				path: '/store-maintenance/stock',
				element: <StockRm />,
				page_name: 'store_maintenance__stock',
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
				name: 'Receive (Maintenance)',
				path: '/store-maintenance/receive',
				element: <Purchase />,
				page_name: 'store_maintenance__receive',
				actions: ['create', 'read', 'update'],
				disableCollapse: true,
				children: [
					{
						name: 'Details',
						path: '/store-maintenance/receive/:purchase_description_uuid',
						element: <PurchaseInd />,
						hidden: true,
						page_name: 'store_maintenance__receive_by_uuid',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store-maintenance/receive/entry',
						element: <PurchaseEntry />,
						hidden: true,
						page_name: 'store_maintenance__receive_entry',
						actions: ['create', 'read', 'update'],
					},
					{
						name: 'Entry',
						path: '/store-maintenance/receive/:purchase_description_uuid/update',
						element: <PurchaseEntry />,
						hidden: true,
						page_name: 'store_maintenance__receive_update',
						actions: ['create', 'read', 'update'],
					},
				],
			},
			{
				name: 'Section',
				path: '/store-maintenance/section',
				element: <Section />,
				page_name: 'store_maintenance__section',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Material Type',
				path: '/store-maintenance/type',
				element: <MaterialType />,
				page_name: 'store_maintenance__type',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Vendor',
				path: '/store-maintenance/vendor',
				element: <Vendor />,
				page_name: 'store_maintenance__vendor',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Log',
				path: '/store-maintenance/log',
				element: <MaterialLog />,
				page_name: 'store_maintenance__log',
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
