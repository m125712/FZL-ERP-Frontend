// Teeth Molding
import VislonTeethMolding from '@/pages/Vislon/TeethMolding/RMStock';
import VislonTeethMoldingSFG from '@/pages/Vislon/TeethMolding/SFG';
import VislonTeethMoldingTrxLog from '@/pages/Vislon/TeethMolding/Log';

// Teeth molding Production
import VislonProduction from '@/pages/Vislon/TeethMolding/Production';

// Finishing
import VislonFinishing from '@/pages/Vislon/Finishing/RMStock';
import VislonFinishingSFG from '@/pages/Vislon/Finishing/SFG';
import VislonFinishingTrxLog from '@/pages/Vislon/Finishing/Log';

// Finishing Production
import VislonFinishingProduction from '@/pages/Vislon/Finishing/Production';

export const VislonRoutes = [
	{
		name: 'Vislon',
		children: [
			{
				name: 'Teeth Molding',
				children: [
					{
						name: 'RM',
						path: '/vislon/teeth-molding/rm',
						element: <VislonTeethMolding />,
						page_name: 'vislon__teeth_molding_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'SFG',
						path: '/vislon/teeth-molding/sfg',
						element: <VislonTeethMoldingSFG />,
						page_name: 'vislon__teeth_molding_sfg',
						actions: [
							'read',
							'click_production',
							'click_to_finishing',
						],
					},
					{
						name: 'Log',
						path: '/vislon/teeth-molding/log',
						element: <VislonTeethMoldingTrxLog />,
						page_name: 'vislon__teeth_molding_log',
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
						path: '/vislon/teeth-molding/production',
						element: <VislonProduction />,
						page_name: 'vislon__teeth_molding_production',
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
						path: '/vislon/finishing/rm',
						element: <VislonFinishing />,
						page_name: 'vislon__finishing_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'SFG',
						path: '/vislon/finishing/sfg',
						element: <VislonFinishingSFG />,
						page_name: 'vislon__finishing_sfg',
						actions: ['read', 'click_production'],
					},
					// * Finishing log
					{
						name: 'Log',
						path: '/vislon/finishing/log',
						element: <VislonFinishingTrxLog />,
						page_name: 'vislon__finishing_log',
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
					// * Finishing Production
					{
						name: 'Production',
						path: '/vislon/finishing/production',
						element: <VislonFinishingProduction />,
						page_name: 'vislon__finishing_production',
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
