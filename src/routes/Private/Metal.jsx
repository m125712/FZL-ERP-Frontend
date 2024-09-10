// Teeth Molding
import MetalTeethMolding from '@/pages/Metal/TeethMolding/RMStock';
import MetalTeethMoldingSFG from '@/pages/Metal/TeethMolding/SFG';
import MetalTeethMoldingTrxLog from '@/pages/Metal/TeethMolding/Log';
import MetalTeethMoldingProduction from '@/pages/Metal/TeethMolding/Production';

// TeethColoring
import MetalTeethColoringRMStock from '@/pages/Metal/TeethColoring/RMStock';
import MetalTeethColoringSFG from '@/pages/Metal/TeethColoring/SFG';
import MetalTeethColoringTrxLog from '@/pages/Metal/TeethColoring/Log';
import MetalTeethColoringProduction from '@/pages/Metal/TeethColoring/Production';

// Finishing
import MetalFinishingRMStock from '@/pages/Metal/Finishing/RMStock';
import MetalFinishingSFG from '@/pages/Metal/Finishing/SFG';
import MetalFinishingTrxLog from '@/pages/Metal/Finishing/Log';
import MetalFinishingProduction from '@/pages/Metal/Finishing/Production';

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
						name: 'SFG',
						path: '/metal/teeth-molding/sfg',
						element: <MetalTeethMoldingSFG />,
						page_name: 'metal__teeth_molding_sfg',
						actions: [
							'read',
							'click_production',
							'click_to_teeth_coloring',
						],
					},
					{
						name: 'Log',
						path: '/metal/teeth-molding/log',
						element: <MetalTeethMoldingTrxLog />,
						page_name: 'metal__teeth_molding_log',
						actions: [
							'read',
							'click_update_sfg',
							'click_delete_sfg',
							'click_update_rm',
							'click_delete_rm',
							'click_update_rm_order',
							'click_delete_rm_order',
							'click_update_tape',
							'click_delete_tape',
						],
					},

					{
						name: 'Production',
						path: '/metal/teeth-molding/production',
						element: <MetalTeethMoldingProduction />,
						page_name: 'metal__teeth_molding_production',
						actions: [
							'create',
							'read',
							'update',
							'click_production',
							'click_transaction',
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
						name: 'SFG',
						path: '/metal/teeth-coloring/sfg',
						element: <MetalTeethColoringSFG />,
						page_name: 'metal__teeth_coloring_sfg',
						actions: [
							'read',
							'click_production',
							'click_to_finishing',
						],
					},
					{
						name: 'Log',
						path: '/metal/teeth-coloring/log',
						element: <MetalTeethColoringTrxLog />,
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
						name: 'Production',
						path: '/metal/teeth-coloring/production',
						element: <MetalTeethColoringProduction />,
						page_name: 'metal__teeth_coloring_production',
						actions: [
							'create',
							'read',
							'update',
							'click_production',
							'click_transaction',
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
						name: 'SFG',
						path: '/metal/finishing/sfg',
						element: <MetalFinishingSFG />,
						page_name: 'metal__finishing_sfg',
						actions: ['read', 'click_production'],
					},
					{
						name: 'Log',
						path: '/metal/finishing/log',
						element: <MetalFinishingTrxLog />,
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
						name: 'Production',
						path: '/metal/finishing/production',
						element: <MetalFinishingProduction />,
						page_name: 'metal__finishing_production',
						actions: [
							'create',
							'read',
							'update',
							'click_production',
							'click_transaction',
						],
					},
				],
			},
		],
	},
];
