// CountLength
import CountLength from '@pages/Thread/CountLength';

//Order
import OrderInfo from '@pages/Thread/Order';
import IndOrderInfo from '@pages/Thread/Order/Details';
import OrderInfoEntry from '@pages/Thread/Order/Entry';
import Machine from '@pages/Thread/Machine';
import Swatch from '@pages/Thread/Swatch';
import DyesCategory from '@pages/Thread/DyesCategory';
import Programs from '@pages/Thread/Programs';
import Coning from '@pages/Thread/Conneing';
import ConingEntry from '@pages/Thread/Conneing/Entry';
import ConingDetails from '@pages/Thread/Conneing/Details';

export const ThreadRoutes = [
	{
		name: 'Thread',
		children: [
			{
				name: 'Count Length',
				path: '/thread/count-length',
				element: <CountLength />,
				page_name: 'thread__count_length',
				actions: ['create', 'read', 'update', 'delete'],
			},

			{
				name: 'Order Info',
				path: '/thread/order-info/details',
				element: <OrderInfo />,
				page_name: 'thread__order_info_details',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Entry',
				path: '/thread/order-info/entry',
				element: <OrderInfoEntry />,
				page_name: 'thread__order_info_entry',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Update',
				path: '/thread/order-info/:order_info_uuid/update',
				element: <OrderInfoEntry />,
				page_name: 'thread__order_info_update',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Details of Order Info',
				path: '/thread/order-info/:order_info_uuid',
				element: <IndOrderInfo />,
				page_name: 'thread__order_info_in_details',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Machine',
				path: '/thread/machine',
				element: <Machine />,
				page_name: 'thread__machine',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Swatch',
				path: '/thread/swatch',
				element: <Swatch />,
				page_name: 'thread__swatch',
				actions: ['read', 'update'],
			},
			{
				name: 'DyesCategory',
				path: '/thread/dyes-category',
				element: <DyesCategory />,
				page_name: 'thread__dyes_category',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Programs',
				path: '/thread/programs',
				element: <Programs />,
				page_name: 'thread__programs',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Coning Entry',
				path: '/thread/coning/:batch_uuid/update',
				element: <ConingEntry />,
				page_name: 'thread__coning_update',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Details of Coning',
				path: '/thread/coning/:batch_uuid',
				element: <ConingDetails />,
				page_name: 'thread__coning_in_details',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Conning',
				path: '/thread/coning',
				element: <Coning />,
				page_name: 'thread__coning_details',
				actions: ['create', 'read', 'update', 'delete'],
			},
		],
	},
];
