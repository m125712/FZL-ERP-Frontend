import OrderEntry from '@/pages/Order/Details/Entry';
import OrderDetails from '@/pages/Order/Details';
import OrderIndByUUID from '@/pages/Order/Details/ByOrderDescriptionUUID';
import OrderFilterByOrderNumber from '@/pages/Order/Details/ByOrderNumber';
import OrderInfo from '@/pages/Order/Info';

import Buyer from '@/pages/Order/Buyer';
import Party from '@/pages/Order/Party';
import Merchandiser from '@/pages/Order/Merchandiser';
import Factory from '@/pages/Order/Factory';
import Marketing from '@/pages/Order/Marketing';
import Properties from '@/pages/Order/Properties';

export const OrderRoutes = [
	{
		name: 'Order',
		children: [
			{
				name: 'Details',
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
				],
			},
			{
				name: 'Details',
				path: '/order/details/:order_number',
				element: <OrderFilterByOrderNumber />,
				hidden: true,
				page_name: 'order__details_by_order_number',
				actions: ['read', 'update'],
				isDynamic: true,
			},
			{
				name: 'Details',
				path: '/order/details/:order_number/:order_description_uuid',
				element: <OrderIndByUUID />,
				hidden: true,
				page_name: 'order__details_by_uuid',
				actions: ['read', 'update', 'show_price'],
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
				name: 'Info',
				path: '/order/info',
				element: <OrderInfo />,
				page_name: 'order__info',
				actions: ['create', 'read', 'update', 'delete'],
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
