// CountLength

// Challan
import Challan from '@pages/Thread/Challan';
import ChallanDetails from '@pages/Thread/Challan/Details';
import ChallanEntry from '@pages/Thread/Challan/Entry';
import Coning from '@pages/Thread/Conneing';
import ConingDetails from '@pages/Thread/Conneing/Details';
import ConingEntry from '@pages/Thread/Conneing/Entry';
import CountLength from '@pages/Thread/CountLength';
// Log
import Log from '@pages/Thread/Log';
//Order
import OrderInfo from '@pages/Thread/Order';
import IndOrderInfo from '@pages/Thread/Order/Details';
import OrderInfoEntry from '@pages/Thread/Order/Entry';

export const ThreadRoutes = [
	{
		name: 'Thread',
		children: [
			{
				name: 'Order',
				path: '/thread/order-info/details',
				element: <OrderInfo />,
				page_name: 'thread__order_info_details',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Count Length',
				path: '/thread/count-length',
				element: <CountLength />,
				page_name: 'thread__count_length',
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
				name: 'Coning',
				path: '/thread/coning',
				element: <Coning />,
				page_name: 'thread__coning_details',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_production',
					'click_transaction',
				],
			},

			{
				name: 'Log',
				path: '/thread/log',
				element: <Log />,
				page_name: 'thread__log',
				actions: ['create', 'read', 'update', 'delete'],
			},

			// Challan
			{
				name: 'Challan',
				path: '/thread/challan',
				element: <Challan />,
				page_name: 'thread__challan',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Challan Details',
				path: '/thread/challan/:uuid',
				element: <ChallanDetails />,
				page_name: 'thread__challan_details',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Challan Entry',
				path: '/thread/challan/entry',
				element: <ChallanEntry />,
				page_name: 'thread__challan_entry',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Challan Update',
				path: '/thread/challan/:challan_uuid/update',
				element: <ChallanEntry />,
				page_name: 'thread__challan_update',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			}
		],
	},
];
