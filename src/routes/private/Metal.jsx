// Teeth Molding
import MetalFinishingTrxLog from '@/pages/Metal/Finishing/Log';
import MetalFinishingProduction from '@/pages/Metal/Finishing/Production';
// Finishing
import MetalFinishingRMStock from '@/pages/Metal/Finishing/RMStock';
import MetalTeethColoringTrxLog from '@/pages/Metal/TeethColoring/Log';
import MetalTeethColoringProduction from '@/pages/Metal/TeethColoring/Production';
// TeethColoring
import MetalTeethColoringRMStock from '@/pages/Metal/TeethColoring/RMStock';
import MetalTeethMoldingTrxLog from '@/pages/Metal/TeethMolding/Log';
import MetalTeethMoldingProduction from '@/pages/Metal/TeethMolding/Production';
import MetalTeethMolding from '@/pages/Metal/TeethMolding/RMStock';

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
						actions: [
							'read',
							'create',
							'delete',
							'update',
						],
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
						actions: [
							'read',
							'create',
							'delete',
							'update',
						],
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
