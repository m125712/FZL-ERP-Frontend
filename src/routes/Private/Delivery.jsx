import { lazy } from 'react';

// Challan
const Challan = lazy(() => import('@pages/Delivery/Challan'));
const ChallanDetails = lazy(() => import('@pages/Delivery/Challan/Details'));
const ChallanEntry = lazy(() => import('@/pages/Delivery/Challan/Entry'));
const RM = lazy(() => import('@pages/Delivery/RM/RMStock'));
const Log = lazy(() => import('@pages/Delivery/Log'));

export const DeliveryRoutes = [
	{
		id: 1,
		name: 'Challan',
		path: '/delivery/challan',
		element: Challan,
		type: 'delivery',
		page_name: 'delivery__challan',
		actions: ['create', 'read', 'update', 'delete', 'click_receive_status'],
	},
	{
		id: 11,
		name: 'Challan',
		path: '/delivery/challan/details/:challan_number',
		element: ChallanDetails,
		type: 'delivery',
		page_name: 'delivery__challan_details',
		actions: ['create', 'read', 'update', 'delete', 'click_receive_status'],
		hidden: true,
	},
	{
		id: 2,
		name: 'Challan Entry',
		path: '/delivery/challan/entry',
		element: ChallanEntry,
		type: 'delivery',
		page_name: 'delivery__challan_entry',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 3,
		name: 'Challan Update',
		path: '/delivery/challan/update/:challan_number/:challan_uuid',
		element: ChallanEntry,
		type: 'delivery',
		page_name: 'delivery__challan_update',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 4,
		name: 'RM',
		path: '/delivery/rm',
		element: RM,
		type: 'delivery',
		page_name: 'delivery__rm',
		actions: ['create', 'read', 'used', 'delete'],
	},
	{
		id: 5,
		name: 'Log',
		path: '/delivery/log',
		element: Log,
		type: 'delivery',
		page_name: 'delivery__log',
		actions: [
			'create',
			'read',
			'update',
			'delete',
			'click_update_rm_order',
			'click_delete_rm_order',
		],
	},
];
