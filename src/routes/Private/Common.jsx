import { Update } from '@/assets/icons';
import { lazy } from 'react';

// ? Common

// * Tape
const TapeStock = lazy(() => import('@/pages/Common/Tape/RM'));
const TapeProd = lazy(() => import('@/pages/Common/Tape/SFG'));
const TapeLog = lazy(() => import('@/pages/Common/Tape/Log'));

// * Coil
const CoilStock = lazy(() => import('@/pages/Common/Coil/RM'));
const CoilProd = lazy(() => import('@/pages/Common/Coil/SFG'));
const CoilLog = lazy(() => import('@/pages/Common/Coil/Log'));

// * Coil Entry to dyeing
const CoilEntryToDyeing = lazy(() => import('@/pages/Common/Coil/SFG/EntryToDyeing'));
// * Tape Entry to dyeing
const TapeEntryToDyeing = lazy(() => import('@/pages/Common/Coil/SFG/EntryToDyeing')); // * sending to the same page since the logic is the same
export const CommonRoutes = [
	{
		id: 21,
		name: 'RM',
		path: '/common/tape/rm',
		element: TapeStock,
		type: ['common', 'tape'],
		page_name: 'common__tape_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 22,
		name: 'SFG',
		path: '/common/tape/sfg',
		element: TapeProd,
		type: ['common', 'tape'],
		page_name: 'common__tape_sfg',
		actions: [
			'read',
			'click_production',
			'click_to_coil',
			'click_to_dyeing',
		],
	},
	{
		id: 23,
		name: 'Log',
		path: '/common/tape/log',
		element: TapeLog,
		type: ['common', 'tape'],
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
	{
		id: 25,
		name: 'SFG',
		path: '/common/tape/sfg/entry-to-dyeing/:coil_uuid',
		element: TapeEntryToDyeing,
		type: ['common', 'coil'],
		hidden: true,
		page_name: 'common__coil_sfg_entry_to_dyeing',
		actions: ['read', 'click_production', 'click_to_dyeing', 'create', 'update'],
	},
	{
		id: 24,
		name: 'RM',
		path: '/common/coil/rm',
		element: CoilStock,
		type: ['common', 'coil'],
		page_name: 'common__coil_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 25,
		name: 'SFG',
		path: '/common/coil/sfg',
		element: CoilProd,
		type: ['common', 'coil'],
		page_name: 'common__coil_sfg',
		actions: ['read', 'click_production', 'click_to_dyeing'],
	},
	{
		id: 25,
		name: 'SFG',
		path: '/common/coil/sfg/entry-to-dyeing/:coil_uuid',
		element: CoilEntryToDyeing,
		type: ['common', 'coil'],
		hidden: true,
		page_name: 'common__coil_sfg_entry_to_dyeing',
		actions: ['read', 'click_production', 'click_to_dyeing', 'create', 'update'],
	},
	{
		id: 26,
		name: 'Log',
		path: '/common/coil/log',
		element: CoilLog,
		type: ['common', 'coil'],
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
];
