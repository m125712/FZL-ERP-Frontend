import { lazy } from 'react';

const ChallanEntry = lazy(() => import('@pages/Delivery/Challan/Entry'));
const Dashboard = lazy(() => import('@pages/Delivery/Dashboard'));
const PackingListsSample = lazy(() => import('@pages/Delivery/PackingList'));
const PackingListsDetails = lazy(
	() => import('@pages/Delivery/PackingList/Details')
);
const PackingListsEntry = lazy(
	() => import('@pages/Delivery/PackingList/Entry')
);
const PackingListsBulkEntry = lazy(
	() => import('@pages/Delivery/PackingList-Bulk/Entry')
);
const WarehouseRecv = lazy(() => import('@pages/Delivery/WarehouseRecv'));
const Carton = lazy(() => import('@pages/Delivery/Carton'));
const Challan = lazy(() => import('@pages/Delivery/Challan'));
const ChallanByDate = lazy(() => import('@pages/Delivery/Challan/ByDate'));
const ChallanDetails = lazy(() => import('@pages/Delivery/Challan/Details'));
const GatePass = lazy(() => import('@pages/Delivery/GatePass'));
const Log = lazy(() => import('@pages/Delivery/Log'));
const RM = lazy(() => import('@pages/Delivery/RM'));
const Vehicle = lazy(() => import('@pages/Delivery/Vehicle'));
const PackingListsBulk = lazy(() => import('@pages/Delivery/PackingList-Bulk'));

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
			// * Gate Pass
			{
				name: 'Gate Pass',
				path: '/delivery/gate-pass',
				element: <GatePass />,
				page_name: 'delivery__gate_pass',
				actions: ['create', 'read', 'click_manual_gate_pass'],
			},
			// * Challan
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
					'click_delivered',
					'click_delivered_override',
					'show_own_orders',
				],
			},
			{
				name: 'Challan By Date',
				path: '/delivery/challan-by-date/:date',
				element: <ChallanByDate />,
				page_name: 'delivery__challan_by_date',
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
				hidden: true,
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
					'show_own_orders',
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
			// * Warehouse Receive
			{
				name: 'Warehouse Receive',
				path: '/delivery/warehouse-receive',
				element: <WarehouseRecv />,
				page_name: 'delivery__warehouse_recv',
				actions: ['create', 'read'],
			},
			// *Packing List
			{
				name: 'Packing List (Sample)',
				path: '/delivery/packing-list-sample',
				element: <PackingListsSample />,
				page_name: 'delivery__packing_list_sample',
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
					'zipper',
					'sample_zipper',
					'thread',
				],
			},
			{
				name: 'Packing List Entry',
				path: '/delivery/packing-list-sample/entry',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_list_sample_entry',
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
				path: '/delivery/packing-list/:uuid',
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
				name: 'Packing List Sample Update',
				path: '/delivery/packing-list-sample/:uuid/update',
				element: <PackingListsEntry />,
				page_name: 'delivery__packing_list_sample_update',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],

				hidden: true,
			},
			// ? Packing List Bulk
			{
				name: 'Packing List (Bulk)',
				path: '/delivery/packing-list-bulk',
				element: <PackingListsBulk />,
				page_name: 'delivery__packing_list_bulk',
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
					'zipper',
					'sample_zipper',
					'thread',
				],
			},
			{
				name: 'Packing List Bulk Entry',
				path: '/delivery/packing-list-bulk/entry',
				element: <PackingListsBulkEntry />,
				page_name: 'delivery__packing_list_bulk_entry',
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
				name: 'Packing List Bulk Details',
				path: '/delivery/packing-list-bulk/:uuid',
				element: <PackingListsDetails />,
				page_name: 'delivery__packing_list_bulk_details',
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
				name: 'Packing List Bulk Update',
				path: '/delivery/packing-list-bulk/:uuid/update',
				element: <PackingListsBulkEntry />,
				page_name: 'delivery__packing_list_bulk_update',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_receive_status',
				],

				hidden: true,
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

			// //* Test
			// {
			// 	name: 'Test',
			// 	path: '/delivery/test',
			// 	element: <Test />,
			// 	page_name: 'delivery__test',
			// 	actions: ['read'],
			// },
		],
	},
];
