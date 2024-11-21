// Thread Clallan
import ChallanEntry from '@/pages/Delivery/Challan/Entry';
// Dashboard
import Dashboard from '@/pages/Delivery/Dashboard';
// Zipper Packing List
import PackingLists from '@/pages/Delivery/PackingList';
import PackingListsDetails from '@/pages/Delivery/PackingList/Details';
import PackingListsEntry from '@/pages/Delivery/PackingList/Entry';
// Zipper -Challan
import Test from '@/pages/Delivery/Test';
import WarehouseRecv from '@/pages/Delivery/WarehouseRecv';
import Carton from '@pages/Delivery/Carton';
import Challan from '@pages/Delivery/Challan';
import ChallanDetails from '@pages/Delivery/Challan/Details';
//Gate Pass
import GatePass from '@pages/Delivery/GatePass';
import Log from '@pages/Delivery/Log';
import RM from '@pages/Delivery/RM';
import Vehicle from '@pages/Delivery/Vehicle';
import ThreadChallan from '@pages/Thread/Challan';
import ThreadChallanDetails from '@pages/Thread/Challan/Details';
import ThreadChallanEntry from '@pages/Thread/Challan/Entry';

export const DeliveryRoutes = [
	{
		name: 'Delivery',
		children: [
			// * Dashboard
			{
				name: 'Dashboard',
				path: '/delivery/dashboard',
				element: <Dashboard />,
				page_name: 'delivery__dashboard',
				actions: ['read'],
			},
			// * RM
			{
				name: 'RM',
				path: '/delivery/rm',
				element: <RM />,
				page_name: 'delivery__rm',
				actions: ['create', 'read', 'used', 'delete'],
			},

			// * Zipper Packing List
			{
				name: 'Zipper Packing List',
				path: '/delivery/zipper-packing-list',
				element: <PackingLists />,
				page_name: 'delivery__packing_list',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					//'click_receive_status',
					'click_received',
					'click_received_override',
					'click_gate_pass',
					'click_gate_pass_override',
				],
			},
			{
				name: 'Warehouse Receive',
				path: '/delivery/warehouse-receive',
				element: <WarehouseRecv />,
				page_name: 'delivery__warehouse_recv',
				actions: ['create', 'read'],
			},

			{
				name: 'Packing List Entry',
				path: '/delivery/zipper-packing-list/entry',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_list_entry',
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
				name: 'Packing List Details',
				path: '/delivery/zipper-packing-list/:uuid',
				element: <PackingListsDetails />,
				page_name: 'delivery__packing_list_details',
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
				name: 'Packing List Update',
				path: '/delivery/zipper-packing-list/:uuid/update',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_list_update',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],

				hidden: true,
			},

			// * Zipper Challan
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
					'click_gate_pass',
					'click_receive_status',
					'click_gate_pass_override',
					'click_receive_status_override',
				],
			},
			{
				name: 'Challan Details',
				path: '/delivery/challan/:uuid',
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
				path: '/delivery/challan/:uuid/update',
				element: <ChallanEntry />,
				page_name: 'delivery__challan_update',
				actions: ['create', 'read', 'update', 'delete'],
				hidden: true,
			},
			{
				name: 'Gate Pass',
				path: '/delivery/gate-pass',
				element: <GatePass />,
				page_name: 'delivery__gate_pass',
				actions: ['create', 'read'],
			},
			// * Thread Challan
			// {
			// 	name: 'Thread Challan',
			// 	path: '/thread/challan',
			// 	element: <ThreadChallan />,
			// 	page_name: 'thread__challan',
			// 	actions: [
			// 		'create',
			// 		'read',
			// 		'update',
			// 		'delete',
			// 		'click_gate_pass',
			// 		'click_receive_status',
			// 		'click_gate_pass_override',
			// 		'click_receive_status_override',
			// 	],
			// },
			// {
			// 	name: 'Thread Challan Details',
			// 	path: '/thread/challan/:uuid',
			// 	element: <ThreadChallanDetails />,
			// 	page_name: 'thread__challan_details',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// 	hidden: true,
			// },
			// {
			// 	name: 'Thread Challan Entry',
			// 	path: '/thread/challan/entry',
			// 	element: <ThreadChallanEntry />,
			// 	page_name: 'thread__challan_entry',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// 	hidden: true,
			// },
			// {
			// 	name: 'Thread Challan Update',
			// 	path: '/thread/challan/:challan_uuid/update',
			// 	element: <ThreadChallanEntry />,
			// 	page_name: 'thread__challan_update',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// 	hidden: true,
			// },
			// * Log
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
			// * Delivery Carton
			{
				name: 'Carton',
				path: '/delivery/carton',
				element: <Carton />,
				page_name: 'delivery__carton',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_active',
					'click_active_override',
				],
			},

			// * Delivery Vehicle
			{
				name: 'Vehicle',
				path: '/delivery/vehicle',
				element: <Vehicle />,
				page_name: 'delivery__vehicle',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_active',
					'click_active_override',
				],
			},
			//* Test
			{
				name: 'Test',
				path: '/delivery/test',
				element: <Test />,
				page_name: 'delivery__test',
				actions: ['read'],
			},
		],
	},
];
