//MetallicFinishing
import NylonMetallicFinishingTrxLog from '@/pages/Nylon/MetallicFinishing/Log';
import NylonMetallicFinishingProduction from '@/pages/Nylon/MetallicFinishing/Production';
import NylonMetallicFinishing from '@/pages/Nylon/MetallicFinishing/RMStock/RMStock';
import NylonPlasticFinishingTrxLog from '@/pages/Nylon/PlasticFinishing/Log';
import NylonPlasticFinishingProduction from '@/pages/Nylon/PlasticFinishing/Production';
//PlasticFinishing
import NylonPlasticFinishing from '@/pages/Nylon/PlasticFinishing/RMStock';

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
						name: 'Production',
						path: '/nylon/metallic-finishing/production',
						element: <NylonMetallicFinishingProduction />,
						page_name: 'nylon__metallic_finishing_production',
						actions: [
							'read',
							'create',
							'update',
							'delete',
							'click_production',
							'click_transaction',
						],
					},
					{
						name: 'Log',
						path: '/nylon/metallic-finishing/log',
						element: <NylonMetallicFinishingTrxLog />,
						page_name: 'nylon__metallic_finishing_log',
						actions: ['read', 'create', 'update', 'delete'],
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
						name: 'Production',
						path: '/nylon/plastic-finishing/production',
						element: <NylonPlasticFinishingProduction />,
						page_name: 'nylon__plastic_finishing_production',
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
						path: '/nylon/plastic-finishing/log',
						element: <NylonPlasticFinishingTrxLog />,
						page_name: 'nylon__plastic_finishing_log',
						actions: ['read', 'create', 'update', 'delete'],
					},
				],
			},
		],
	},
];
