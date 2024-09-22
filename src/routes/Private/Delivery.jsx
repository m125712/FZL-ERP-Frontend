//Packing Lists

// Challan
import ChallanEntry from '@/pages/Delivery/Challan/Entry';
import PackingLists from '@/pages/Delivery/PackingLists';
import PackingListsEntry from '@/pages/Delivery/PackingLists/Entry';
import Challan from '@pages/Delivery/Challan';
import ChallanDetails from '@pages/Delivery/Challan/Details';
import Log from '@pages/Delivery/Log';
import RM from '@pages/Delivery/RM';

export const DeliveryRoutes = [
	{
		name: 'Delivery',
		children: [
			{
				name: 'Packing Lists',
				path: '/delivery/packing-lists',
				element: <PackingLists />,
				page_name: 'delivery__packing_lists',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
			},
			{
				name: 'Packing Lists Entry',
				path: '/delivery/packing-lists/entry',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_lists_entry',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
				hidden: true,
			},
			{
				name: 'Packing Lists Update',
				path: '/delivery/packing-lists/:uuid/update',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_lists_update',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],

				hidden: true,
			},
			{
				name: 'Challan',
				path: '/delivery/challan',
				element: <Challan />,
				page_name: 'delivery__challan',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
			},
			{
				name: 'Challan',
				path: '/delivery/challan/details/:challan_number',
				element: <ChallanDetails />,
				page_name: 'delivery__challan_details',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],
				hidden: true,
			},
			{
				name: 'Challan Entry',
				path: '/delivery/challan/entry',
				element: <ChallanEntry />,
				page_name: 'delivery__challan_entry',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Challan Update',
				path: '/delivery/challan/:challan_number/:challan_uuid/update',
				element: <ChallanEntry />,
				page_name: 'delivery__challan_update',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'RM',
				path: '/delivery/rm',
				element: <RM />,
				page_name: 'delivery__rm',
				actions: ['create', 'read', 'used', 'delete'],
			},
			{
				name: 'Log',
				path: '/delivery/log',
				element: <Log />,
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
		],
	},
];
