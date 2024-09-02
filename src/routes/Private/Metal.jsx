import { lazy } from 'react';

// Teeth Molding
const MetalTeethMolding = lazy(
	() => import('@/pages/Metal/TeethMolding/RMStock/RMStock')
);
const MetalTeethMoldingSFG = lazy(
	() => import('@/pages/Metal/TeethMolding/SFG')
);
const MetalTeethMoldingTrxLog = lazy(
	() => import('@/pages/Metal/TeethMolding/Log')
);

const MetalTeethMoldingProduction = lazy(
	() => import('@/pages/Metal/TeethMolding/Production')
);

// TeethColoring
const MetalTeethColoringRMStock = lazy(
	() => import('@/pages/Metal/TeethColoring/RMStock/RMStock')
);
const MetalTeethColoringSFG = lazy(
	() => import('@/pages/Metal/TeethColoring/SFG')
);
const MetalTeethColoringTrxLog = lazy(
	() => import('@/pages/Metal/TeethColoring/Log')
);

const MetalTeethColoringProduction = lazy(
	() => import('@/pages/Metal/TeethColoring/Production')
);

// Finishing
const MetalFinishingRMStock = lazy(
	() => import('@/pages/Metal/Finishing/RMStock/RMStock')
);
const MetalFinishingSFG = lazy(() => import('@/pages/Metal/Finishing/SFG'));
const MetalFinishingTrxLog = lazy(() => import('@/pages/Metal/Finishing/Log'));
const MetalFinishingProduction = lazy(
	() => import('@/pages/Metal/Finishing/Production')
);

export const MetalRoutes = [
	{
		id: 30,
		name: 'RM',
		path: '/metal/teeth-molding/rm',
		element: MetalTeethMolding,
		type: ['metal', 'teeth-molding'],
		page_name: 'metal__teeth_molding_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 301,
		name: 'SFG',
		path: '/metal/teeth-molding/sfg',
		element: MetalTeethMoldingSFG,
		type: ['metal', 'teeth-molding'],
		page_name: 'metal__teeth_molding_sfg',
		actions: ['read', 'click_production', 'click_to_teeth_coloring'],
	},
	{
		id: 302,
		name: 'Log',
		path: '/metal/teeth-molding/log',
		element: MetalTeethMoldingTrxLog,
		type: ['metal', 'teeth-molding'],
		page_name: 'metal__teeth_molding_log',
		actions: [
			'read',
			'click_update_sfg',
			'click_delete_sfg',
			'click_update_rm',
			'click_delete_rm',
			'click_update_rm_order',
			'click_delete_rm_order',
		],
	},

	{
		id: 301,
		name: 'Production',
		path: '/metal/teeth-molding/production',
		element: MetalTeethMoldingProduction,
		type: ['metal', 'teeth-molding'],
		page_name: 'metal__teeth_molding_production',
		actions: [
			'create',
			'read',
			'update',
			'click_production',
			'click_transaction',
		],
	},

	{
		id: 31,
		name: 'RM',
		path: '/metal/teeth-coloring/rm',
		element: MetalTeethColoringRMStock,
		type: ['metal', 'teeth-coloring'],
		page_name: 'metal__teeth_coloring_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 311,
		name: 'SFG',
		path: '/metal/teeth-coloring/sfg',
		element: MetalTeethColoringSFG,
		type: ['metal', 'teeth-coloring'],
		page_name: 'metal__teeth_coloring_sfg',
		actions: ['read', 'click_production', 'click_to_finishing'],
	},
	{
		id: 312,
		name: 'Log',
		path: '/metal/teeth-coloring/log',
		element: MetalTeethColoringTrxLog,
		type: ['metal', 'teeth-coloring'],
		page_name: 'metal__teeth_coloring_log',
		actions: [
			'read',
			'click_update_sfg',
			'click_delete_sfg',
			'click_update_rm',
			'click_delete_rm',
			'click_update_rm_order',
			'click_delete_rm_order',
		],
	},

	{
		id: 301,
		name: 'Production',
		path: '/metal/teeth-coloring/production',
		element: MetalTeethColoringProduction,
		type: ['metal', 'teeth-coloring'],
		page_name: 'metal__teeth_coloring_production',
		actions: [
			'create',
			'read',
			'update',
			'click_production',
			'click_transaction',
		],
	},
	{
		id: 32,
		name: 'RM',
		path: '/metal/finishing/rm',
		element: MetalFinishingRMStock,
		type: ['metal', 'finishing'],
		page_name: 'metal__finishing_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 321,
		name: 'SFG',
		path: '/metal/finishing/sfg',
		element: MetalFinishingSFG,
		type: ['metal', 'finishing'],
		page_name: 'metal__finishing_sfg',
		actions: ['read', 'click_production'],
	},
	{
		id: 322,
		name: 'Log',
		path: '/metal/finishing/log',
		element: MetalFinishingTrxLog,
		type: ['metal', 'finishing'],
		page_name: 'metal__finishing_log',
		actions: [
			'read',
			'click_update_sfg',
			'click_delete_sfg',
			'click_update_rm',
			'click_delete_rm',
			'click_update_rm_order',
			'click_delete_rm_order',
		],
	},

	{
		id: 301,
		name: 'Production',
		path: '/metal/finishing/production',
		element: MetalFinishingProduction,
		type: ['metal', 'finishing'],
		page_name: 'metal__finishing_production',
		actions: [
			'create',
			'read',
			'update',
			'click_production',
			'click_transaction',
		],
	},
];
