//MetallicFinishing
import NylonMetallicFinishing from '@/pages/Nylon/MetallicFinishing/RMStock/RMStock';
import NylonMetallicFinishingSFG from '@/pages/Nylon/MetallicFinishing/SFG';
import NylonMetallicFinishingTrxLog from '@/pages/Nylon/MetallicFinishing/Log';
import NylonMetallicFinishingProduction from '@/pages/Nylon/MetallicFinishing/Production';

//PlasticFinishing
import NylonPlasticFinishing from '@/pages/Nylon/PlasticFinishing/RMStock';
import NylonPlasticFinishingSFG from '@/pages/Nylon/PlasticFinishing/SFG';
import NylonPlasticFinishingTrxLog from '@/pages/Nylon/PlasticFinishing/Log';
import NylonPlasticFinishingProduction from '@/pages/Nylon/PlasticFinishing/Production';

export const NylonRoutes = [
	{
		name: 'Nylon',
		children: [
			{
				name: 'Metallic Finishing',
				children: [
					{
						name: 'RM',
						path: '/nylon/metallic-finishing/rm',
						element: <NylonMetallicFinishing />,
						page_name: 'nylon__metallic_finishing_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'SFG',
						path: '/nylon/metallic-finishing/sfg',
						element: <NylonMetallicFinishingSFG />,
						page_name: 'nylon__metallic_finishing_sfg',
						actions: ['read', 'click_production'],
					},
					{
						name: 'Log',
						path: '/nylon/metallic-finishing/log',
						element: <NylonMetallicFinishingTrxLog />,
						page_name: 'nylon__metallic_finishing_log',
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
						path: '/nylon/metallic-finishing/production',
						element: <NylonMetallicFinishingProduction />,
						page_name: 'nylon__metallic_finishing_production',
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
				name: 'Plastic Finishing',
				children: [
					{
						name: 'RM',
						path: '/nylon/plastic-finishing/rm',
						element: <NylonPlasticFinishing />,
						page_name: 'nylon__plastic_finishing_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'SFG',
						path: '/nylon/plastic-finishing/sfg',
						element: <NylonPlasticFinishingSFG />,
						page_name: 'nylon__plastic_finishing_sfg',
						actions: ['read', 'click_production'],
					},
					{
						name: 'Log',
						path: '/nylon/plastic-finishing/log',
						element: <NylonPlasticFinishingTrxLog />,
						page_name: 'nylon__plastic_finishing_log',
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
						path: '/nylon/plastic-finishing/production',
						element: <NylonPlasticFinishingProduction />,
						page_name: 'nylon__plastic_finishing_production',
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
