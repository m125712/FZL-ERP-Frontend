import { lazy } from 'react';

// Pages
// Order
const OrderEntry = lazy(() => import('@/pages/Order/Details/Entry'));
const OrderDetails = lazy(() => import('@/pages/Order/Details'));
const OrderIndByUUID = lazy(
	() => import('@/pages/Order/Details/ByOrderDescriptionUUID')
);
const OrderFilterByOrderNumber = lazy(
	() => import('@/pages/Order/Details/ByOrderNumber')
);
const OrderInfo = lazy(() => import('@/pages/Order/Info'));
// const OrderPlanning = lazy(() => import("@/pages/Order/Planning"));
const Buyer = lazy(() => import('@/pages/Order/Buyer'));
const Party = lazy(() => import('@/pages/Order/Party'));
const Merchandiser = lazy(() => import('@/pages/Order/Merchandiser'));
const Factory = lazy(() => import('@/pages/Order/Factory'));
const Marketing = lazy(() => import('@/pages/Order/Marketing'));
const Properties = lazy(() => import('@/pages/Order/Properties'));

export const OrderRoutes = [
	{
		id: 14,
		name: 'Details',
		path: '/order/details',
		element: OrderDetails,
		type: 'order',
		page_name: 'order__details',
		actions: [
			'create',
			'read',
			'update',
			'delete',
			'click_order_number',
			'click_item_description',
			'show_all_orders',
			'show_own_orders',
			'show_approved_orders',
		],
	},
	{
		id: 142,
		name: 'Details',
		path: '/order/details/:order_number',
		element: OrderFilterByOrderNumber,
		type: 'order',
		hidden: true,
		page_name: 'order__details_by_order_number',
		actions: ['read', 'update'],
		isDynamic: true,
	},
	{
		id: 141,
		name: 'Details',
		path: '/order/details/:order_number/:order_description_uuid',
		element: OrderIndByUUID,
		type: 'order',
		hidden: true,
		page_name: 'order__details_by_uuid',
		actions: ['read', 'update', 'show_price'],
		isDynamic: true,
	},
	{
		id: 15,
		name: 'Entry',
		path: '/order/entry',
		element: OrderEntry,
		type: 'order',
		hidden: true,
		page_name: 'order__entry',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 151,
		name: 'Entry',
		path: '/order/update/:order_number/:order_description_uuid',
		element: OrderEntry,
		page_name: 'order__entry_update',
		hidden: true,
		actions: ['create', 'read', 'update', 'delete'],
		isDynamic: true,
	},
	{
		id: 152,
		name: 'Info',
		path: '/order/info',
		element: OrderInfo,
		type: 'order',
		page_name: 'order__info',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 16,
		name: 'Buyer',
		path: '/order/buyer',
		element: Buyer,
		type: 'order',
		page_name: 'order__buyer',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 17,
		name: 'Marketing',
		path: '/order/marketing',
		element: Marketing,
		type: 'order',
		page_name: 'order__marketing',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 20,
		name: 'Merchandiser',
		path: '/order/merchandiser',
		element: Merchandiser,
		type: 'order',
		page_name: 'order__merchandiser',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 21,
		name: 'Factory',
		path: '/order/factory',
		element: Factory,
		type: 'order',
		page_name: 'order__factory',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 19,
		name: 'Party',
		path: '/order/party',
		element: Party,
		type: 'order',
		page_name: 'order__party',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 18,
		name: 'Properties',
		path: '/order/properties',
		element: Properties,
		type: 'order',
		page_name: 'order__properties',
		actions: ['create', 'read', 'update', 'delete'],
	},
];
