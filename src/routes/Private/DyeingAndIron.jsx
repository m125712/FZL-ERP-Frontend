import { lazy } from 'react';

// Dyeing And Iron
const DyeingRMStock = lazy(
	() => import('@/pages/DyeingAndIron/RMStock/RMStock')
);
const DyeingSFG = lazy(() => import('@/pages/DyeingAndIron/SFG'));
const DyeingLog = lazy(() => import('@/pages/DyeingAndIron/Log'));
const DyeingSwatch = lazy(() => import('@/pages/DyeingAndIron/Swatch'));
const DyeingPlanning = lazy(() => import('@/pages/DyeingAndIron/Planning'));

export const DyeingAndIronRoutes = [
	{
		id: 28,
		name: 'RM',
		path: '/dyeing-and-iron/rm',
		element: DyeingRMStock,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 281,
		name: 'SFG',
		path: '/dyeing-and-iron/sfg',
		element: DyeingSFG,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_sfg',
		actions: ['read', 'click_production', 'click_transaction'],
	},
	{
		id: 282,
		name: 'Log',
		path: '/dyeing-and-iron/log',
		element: DyeingLog,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_log',
		actions: [
			'read',
			'click_update_sfg',
			'click_delete_sfg',
			'click_update_rm',
			'click_delete_rm',
			'click_update_production',
			'click_delete_production',
		],
	},
	{
		id: 283,
		name: 'Swatch',
		path: '/dyeing-and-iron/swatch',
		element: DyeingSwatch,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_swatch',
		actions: ['read', 'update'],
	},
	{
		id: 284,
		name: 'Planning',
		path: '/dyeing-and-iron/planning',
		element: DyeingPlanning,
		type: 'dyeing',
		page_name: 'dyeing__planning',
		actions: ['read'],
	},
];
