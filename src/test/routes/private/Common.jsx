// * Tape
import TapeStock from '@/pages/Common/Tape/RM';
import TapeProd from '@/pages/Common/Tape/SFG';
import TapeLog from '@/pages/Common/Tape/Log';

// * Coil
import CoilStock from '@/pages/Common/Coil/RM';
import CoilProd from '@/pages/Common/Coil/SFG';
import CoilLog from '@/pages/Common/Coil/Log';

// * Coil Entry to dyeing
import CoilEntryToDyeing from '@/pages/Common/Coil/SFG/EntryToDyeing';

// * Tape Entry to dyeing
import TapeEntryToDyeing from '@/pages/Common/Coil/SFG/EntryToDyeing';

export const CommonRoutes = [
	{
		name: 'Common',
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
							'click_production',
							'click_to_dyeing',
							'create',
							'update',
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
							'click_update_rm_order',
							'click_delete_rm_order',
						],
					},
				],
			},
		],
	},
];
