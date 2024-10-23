// * Tape

// * Coil
import CoilLog from '@/pages/Common/Coil/Log';
import CoilStock from '@/pages/Common/Coil/RM';
import CoilProd from '@/pages/Common/Coil/SFG';
// * Coil Entry to dyeing
import CoilEntryToDyeing from '@/pages/Common/Coil/SFG/EntryToDyeing';
// * Tape Entry to dyeing
import TapeEntryToDyeing from '@/pages/Common/Coil/SFG/EntryToDyeing';
// * Multi-Color
import MultiColorDashboard from '@/pages/Common/MultiColor/Dashboard';
import MultiColorLog from '@/pages/Common/MultiColor/Log';
import TapeLog from '@/pages/Common/Tape/Log';
import TapeRequired from '@/pages/Common/Tape/Required';
import TapeStock from '@/pages/Common/Tape/RM';
import TapeProd from '@/pages/Common/Tape/SFG';
//*SFG Tape Transfer
import SFGEntryToTransfer from '@/pages/Common/Tape/SFG/Transfer';
//* Dyeing Transfer
import DyeingTransfer from '@/pages/Common/Transfer';
import DyeingTransferEntry from '@/pages/Common/Transfer/EntryUpdate';

export const CommonRoutes = [
	{
		name: 'Tape Preparation',
		children: [
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
						name: 'Required',
						path: '/common/tape/required',
						element: <TapeRequired />,
						page_name: 'common__tape_required',
						actions: ['read', 'create', 'update', 'delete'],
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
						actions: ['read', 'create', 'update'],
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
