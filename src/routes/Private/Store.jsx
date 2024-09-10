import { lazy } from 'react';

// Pages
// Material
const Stock = lazy(() => import('@/pages/Store/Stock'));
const Section = lazy(() => import('@/pages/Store/Section'));
const MaterialType = lazy(() => import('@/pages/Store/Type'));
const Summary = lazy(() => import('@/pages/Store/Summary'));
const MaterialLog = lazy(() => import('@/pages/Store/Log'));

// Purchase
const Vendor = lazy(() => import('@/pages/Store/Vendor'));
const Purchase = lazy(() => import('@/pages/Store/Receive'));
const PurchaseEntry = lazy(() => import('@/pages/Store/Receive/Entry'));
const PurchaseInd = lazy(
	() => import('@/pages/Store/Receive/Details/ByPurchaseDescriptionUUID')
);

export const StoreRoutes = [
	{
		id: 4,
		name: 'Stock',
		path: '/store/stock',
		element: Stock,
		type: 'store',
		page_name: 'store__stock',
		actions: [
			'create',
			'read',
			'update',
			'delete',
			'click_trx_against_order',
			'click_action',
		],
	},

	{
		id: 401,
		name: 'Summary',
		path: '/material/:material_id',
		element: Summary,
		type: 'store',
		hidden: true,
	},
	{
		if: 5,
		name: 'Section',
		path: '/store/section',
		element: Section,
		type: 'store',
		page_name: 'store__section',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 6,
		name: 'Type',
		path: '/store/type',
		element: MaterialType,
		type: 'store',
		page_name: 'store__type',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 9,
		name: 'Vendor',
		path: '/store/vendor',
		element: Vendor,
		type: 'store',
		page_name: 'store__vendor',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 7,
		name: 'Receive',
		path: '/store/receive',
		element: Purchase,
		type: 'store',
		page_name: 'store__receive',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 71,
		name: 'Details',
		path: '/store/receive/:purchase_description_uuid',
		element: PurchaseInd,
		type: 'store',
		hidden: true,
		page_name: 'store__receive_by_uuid',
		actions: ['create', 'read', 'update'],
	},

	{
		id: 10,
		name: 'Entry',
		path: '/store/receive/entry',
		element: PurchaseEntry,
		type: 'store',
		hidden: true,
		page_name: 'store__receive_entry',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 10,
		name: 'Entry',
		path: '/store/receive/:purchase_description_uuid/update',
		element: PurchaseEntry,
		type: 'store',
		hidden: true,
		page_name: 'store__receive_update',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 301,
		name: 'Log',
		path: '/store/log',
		element: MaterialLog,
		type: 'store',
		page_name: 'store__log',
		actions: [
			'read',
			'update_log',
			'delete_log',
			'update_log_against_order',
			'delete_log_against_order',
		],
	},
];
