import { lazy } from 'react';

const CoilLog = lazy(() => import('@/pages/Common/Coil/Log'));
const CoilStock = lazy(() => import('@/pages/Common/Coil/RM'));
const CoilProd = lazy(() => import('@/pages/Common/Coil/SFG'));
const CoilEntryToDyeing = lazy(
	() => import('@/pages/Common/Coil/SFG/EntryToDyeing')
);
const TapeEntryToDyeing = lazy(
	() => import('@/pages/Common/Coil/SFG/EntryToDyeing')
);
const MultiColorDashboard = lazy(
	() => import('@/pages/Common/MultiColor/Dashboard')
);
const MultiColorLog = lazy(() => import('@/pages/Common/MultiColor/Log'));
const TapeLog = lazy(() => import('@/pages/Common/Tape/Log'));
const TapeRequired = lazy(() => import('@/pages/Common/Tape/Required'));
const TapeStock = lazy(() => import('@/pages/Common/Tape/RM'));
const TapeProd = lazy(() => import('@/pages/Common/Tape/SFG'));
const SFGEntryToTransfer = lazy(
	() => import('@/pages/Common/Tape/SFG/Transfer')
);
const TapeAssign = lazy(() => import('@/pages/Common/TapeAssign'));
const DyeingTransfer = lazy(() => import('@/pages/Common/Transfer'));
const DyeingTransferEntry = lazy(
	() => import('@/pages/Common/Transfer/EntryUpdate')
);

export const CommonRoutes = [
	{
		name: 'Tape Preparation',
		children: [
			{
				name: 'Tape Assign',
				path: '/common/tape-assign',
				element: <TapeAssign />,
				page_name: 'common__tape_assign',
				actions: [
					'read',
					'create',
					'update',
					'delete',
					'click_tape_assign',
					'click_tape_assign_override',
				],
			},
			{
				name: 'Tape Required',
				path: '/common/tape-required',
				element: <TapeRequired />,
				page_name: 'common__tape_required',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Tape',
				children: [
					{
						name: 'RM',
						path: '/common/tape/rm',
						element: <TapeStock />,
						page_name: 'common__tape_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'SFG',
						path: '/common/tape/sfg',
						element: <TapeProd />,
						page_name: 'common__tape_sfg',
						actions: [
							'read',
							'click_production',
							'click_to_coil',
							'click_to_dyeing',
							'click_to_dyeing_against_stock',
							'click_to_stock',
							'click_to_transfer',
							'update',
							'delete',
						],
					},
					{
						name: 'Log',
						path: '/common/tape/log',
						element: <TapeLog />,
						page_name: 'common__tape_log',
						actions: [
							'read',
							'update',
							'delete',
							'click_update_tape_to_coil',
							'click_delete_tape_to_coil',
							'click_update_tape_to_dying',
							'click_delete_tape_to_dying',
							'click_update_tape_production',
							'click_delete_tape_production',
							'click_update_rm',
							'click_delete_rm',
							'click_update_rm_order',
							'click_delete_rm_order',
							'click_delete_transfer',
							'click_update_transfer',
						],
					},

					{
						name: 'SFG To Transfer',
						path: '/common/tape/sfg/entry-to-transfer/:uuid',
						element: <SFGEntryToTransfer />,
						hidden: true,
						page_name: 'common__tape_sfg_entry_to_transfer',
						actions: [
							'read',
							'create',
							'update',
							'click_production',
							'click_to_dyeing',
						],
					},
				],
			},

			{
				name: 'Coil',
				children: [
					{
						name: 'SFG',
						path: '/common/tape/sfg/entry-to-dyeing/:coil_uuid',
						element: <TapeEntryToDyeing />,
						hidden: true,
						page_name: 'common__tape_sfg_entry_to_dyeing',
						actions: [
							'read',
							'create',
							'update',
							'click_production',
							'click_to_dyeing',
						],
					},
					{
						name: 'RM',
						path: '/common/coil/rm',
						element: <CoilStock />,
						page_name: 'common__coil_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'SFG',
						path: '/common/coil/sfg',
						element: <CoilProd />,
						page_name: 'common__coil_sfg',
						actions: [
							'read',
							'click_production',
							'click_to_dyeing',
							'click_to_dyeing_against_stock',
							'click_to_stock',
							'click_to_transfer',
						],
					},
					{
						name: 'SFG',
						path: '/common/coil/sfg/entry-to-dyeing/:coil_uuid',
						element: <CoilEntryToDyeing />,
						hidden: true,
						page_name: 'common__coil_sfg_entry_to_dyeing',
						actions: [
							'read',
							'click_production',
							'click_to_dyeing',
							'create',
							'update',
						],
					},
					{
						name: 'SFG To Transfer',
						path: '/common/coil/sfg/entry-to-transfer/:uuid',
						element: <SFGEntryToTransfer />,
						hidden: true,
						page_name: 'common__common_sfg_entry_to_transfer',
						actions: [
							'read',
							'create',
							'update',
							'click_production',
							'click_to_dyeing',
						],
					},
					{
						name: 'Log',
						path: '/common/coil/log',
						element: <CoilLog />,
						page_name: 'common__coil_log',
						actions: [
							'read',
							'update',
							'delete',
							'click_update_sfg',
							'click_delete_sfg',
							'click_update_rm',
							'click_delete_rm',
							'click_update_coil_production',
							'click_delete_coil_production',
							'click_update_tape_to_coil',
							'click_delete_tape_to_coil',
							'click_update_rm_order',
							'click_delete_rm_order',
							'click_delete_transfer',
							'click_update_transfer',
						],
					},
				],
			},
			// * Multi-Color
			{
				name: 'Multi-Color',
				children: [
					{
						name: 'Dashboard',
						path: '/common/multi-color/dashboard',
						element: <MultiColorDashboard />,
						page_name: 'common__multi_color_dashboard',
						actions: [
							'read',
							'create',
							'update',
							'delete',
							'click_receive',
							'click_approve_thread',
							'click_approve_coil',
							'click_approve_swatch',
						],
					},
					{
						name: 'Log',
						path: '/common/multi-color/log',
						element: <MultiColorLog />,
						page_name: 'common__multi_color_log',
						actions: ['read', 'create', 'update', 'delete'],
					},
				],
			},
			{
				name: 'Dyed Store',
				path: '/common/dyed-store',
				element: <DyeingTransfer />,
				page_name: 'common__dyeing_transfer',
				actions: ['read', 'create', 'update', 'delete'],
			},

			{
				name: 'Transfer Entry',
				path: '/common/dyed-store/entry',
				element: <DyeingTransferEntry />,
				hidden: true,
				page_name: 'common__dyeing_transfer_entry',
				actions: ['read', 'create', 'update', 'delete'],
			},
		],
	},
];
