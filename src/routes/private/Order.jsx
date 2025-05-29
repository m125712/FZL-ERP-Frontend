import { lazy } from 'react';

// import Buyer from '@/pages/Order/Buyer';
// import OrderDetails from '@/pages/Order/Details';
// import OrderIndByUUID from '@/pages/Order/Details/ByOrderDescriptionUUID';
// import OrderFilterByOrderNumber from '@/pages/Order/Details/ByOrderNumber';
// import OrderEntry from '@/pages/Order/Details/Entry';
// import Factory from '@/pages/Order/Factory';
// import OrderInfo from '@/pages/Order/Info';
// import Marketing from '@/pages/Order/Marketing';
// import Merchandiser from '@/pages/Order/Merchandiser';
// import Party from '@/pages/Order/Party';
// import Properties from '@/pages/Order/Properties';

const Buyer = lazy(() => import('@/pages/Order/Buyer'));
const OrderDetails = lazy(() => import('@/pages/Order/Details'));
const OrderIndByUUID = lazy(
	() => import('@/pages/Order/Details/ByOrderDescriptionUUID')
);
const OrderFilterByOrderNumber = lazy(
	() => import('@/pages/Order/Details/ByOrderNumber')
);
const OrderEntry = lazy(() => import('@/pages/Order/Details/Entry'));
const Factory = lazy(() => import('@/pages/Order/Factory'));
const OrderInfo = lazy(() => import('@/pages/Order/Info'));
const Marketing = lazy(() => import('@/pages/Order/Marketing'));
const Merchandiser = lazy(() => import('@/pages/Order/Merchandiser'));
const Party = lazy(() => import('@/pages/Order/Party'));
const Properties = lazy(() => import('@/pages/Order/Properties'));

export const OrderRoutes = [
	{
		name: 'Order',
		children: [
			{
				name: 'Product Description',
				path: '/order/details',
				element: <OrderDetails />,
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
					'show_price',
					'show_cash_bill_lc',
					'show_history',
					'click_status_marketing_checked',
				],
			},
			{
				name: 'Product Description',
				path: '/order/details/:order_number',
				element: <OrderFilterByOrderNumber />,
				hidden: true,
				page_name: 'order__details_by_order_number',
				actions: ['read', 'update'],
				isDynamic: true,
			},
			{
				name: 'Product Description',
				path: '/order/details/:order_number/:order_description_uuid',
				element: <OrderIndByUUID />,
				hidden: true,
				page_name: 'order__details_by_uuid',
				actions: ['read', 'update'],
				isDynamic: true,
			},
			{
				name: 'Entry',
				path: '/order/entry',
				element: <OrderEntry />,
				hidden: true,
				page_name: 'order__entry',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Entry',
				path: '/order/:order_number/:order_description_uuid/update',
				element: <OrderEntry />,
				page_name: 'order__entry_update',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
				isDynamic: true,
			},
			{
				name: 'Party Description',
				path: '/order/party-description',
				element: <OrderInfo />,
				page_name: 'order__party_description',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_status_production_paused',
					'click_status_sno_from_head_office',
					'click_status_receive_by_factory',
				],
			},
			{
				name: 'Buyer',
				path: '/order/buyer',
				element: <Buyer />,
				page_name: 'order__buyer',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Marketing',
				path: '/order/marketing',
				element: <Marketing />,
				page_name: 'order__marketing',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Merchandiser',
				path: '/order/merchandiser',
				element: <Merchandiser />,
				page_name: 'order__merchandiser',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Factory',
				path: '/order/factory',
				element: <Factory />,
				page_name: 'order__factory',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Party',
				path: '/order/party',
				element: <Party />,
				page_name: 'order__party',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Properties',
				path: '/order/properties',
				element: <Properties />,
				page_name: 'order__properties',
				actions: ['create', 'read', 'update', 'delete'],
			},
		],
	},
];
