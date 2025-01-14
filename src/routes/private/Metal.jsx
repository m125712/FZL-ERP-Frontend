import { lazy } from 'react';

const MetalFinishingTrxLog = lazy(() => import('@/pages/Metal/Finishing/Log'));
const MetalFinishingProduction = lazy(
	() => import('@/pages/Metal/Finishing/Production')
);
const MetalFinishingRMStock = lazy(
	() => import('@/pages/Metal/Finishing/RMStock')
);
const MetalTeethColoringTrxLog = lazy(
	() => import('@/pages/Metal/TeethColoring/Log')
);
const MetalTeethColoringProduction = lazy(
	() => import('@/pages/Metal/TeethColoring/Production')
);
const MetalTeethColoringRMStock = lazy(
	() => import('@/pages/Metal/TeethColoring/RMStock')
);
const MetalTeethMoldingTrxLog = lazy(
	() => import('@/pages/Metal/TeethMolding/Log')
);
const MetalTeethMoldingProduction = lazy(
	() => import('@/pages/Metal/TeethMolding/Production')
);
const MetalTeethMolding = lazy(
	() => import('@/pages/Metal/TeethMolding/RMStock')
);

export const MetalRoutes = [
	{
		name: 'Metal',
		children: [
			{
				name: 'Teeth Molding',
				children: [
					{
						name: 'RM',
						path: '/metal/teeth-molding/rm',
						element: <MetalTeethMolding />,
						page_name: 'metal__teeth_molding_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'Production',
						path: '/metal/teeth-molding/production',
						element: <MetalTeethMoldingProduction />,
						page_name: 'metal__teeth_molding_production',
						actions: [
							'read',
							'create',
							'delete',
							'update',
							'click_production',
							'click_transaction',
						],
					},
					{
						name: 'Log',
						path: '/metal/teeth-molding/log',
						element: <MetalTeethMoldingTrxLog />,
						page_name: 'metal__teeth_molding_log',
						actions: ['read', 'create', 'delete', 'update'],
					},
				],
			},

			{
				name: 'Teeth Coloring',
				children: [
					{
						name: 'RM',
						path: '/metal/teeth-coloring/rm',
						element: <MetalTeethColoringRMStock />,
						page_name: 'metal__teeth_coloring_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'Production',
						path: '/metal/teeth-coloring/production',
						element: <MetalTeethColoringProduction />,
						page_name: 'metal__teeth_coloring_production',
						actions: [
							'read',
							'create',
							'delete',
							'update',
							'click_production',
							'click_transaction',
						],
					},
					{
						name: 'Log',
						path: '/metal/teeth-coloring/log',
						element: <MetalTeethColoringTrxLog />,
						page_name: 'metal__teeth_coloring_log',
						actions: ['read', 'create', 'delete', 'update'],
					},
				],
			},
			{
				name: 'Finishing',
				children: [
					{
						name: 'RM',
						path: '/metal/finishing/rm',
						element: <MetalFinishingRMStock />,
						page_name: 'metal__finishing_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'Production',
						path: '/metal/finishing/production',
						element: <MetalFinishingProduction />,
						page_name: 'metal__finishing_production',
						actions: [
							'read',
							'create',
							'delete',
							'update',
							'click_production',
							'click_transaction',
						],
					},
					{
						name: 'Log',
						path: '/metal/finishing/log',
						element: <MetalFinishingTrxLog />,
						page_name: 'metal__finishing_log',
						actions: [
							'read',
							'create',
							'delete',
							'update',
						],
					},
				],
			},
		],
	},
];
