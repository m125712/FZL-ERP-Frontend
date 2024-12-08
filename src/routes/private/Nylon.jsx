import { lazy } from 'react';

const NylonMetallicFinishingTrxLog = lazy(
	() => import('@/pages/Nylon/MetallicFinishing/Log')
);
const NylonMetallicFinishingProduction = lazy(
	() => import('@/pages/Nylon/MetallicFinishing/Production')
);
const NylonMetallicFinishing = lazy(
	() => import('@/pages/Nylon/MetallicFinishing/RMStock/RMStock')
);
const NylonPlasticFinishingTrxLog = lazy(
	() => import('@/pages/Nylon/PlasticFinishing/Log')
);
const NylonPlasticFinishingProduction = lazy(
	() => import('@/pages/Nylon/PlasticFinishing/Production')
);
const NylonPlasticFinishing = lazy(
	() => import('@/pages/Nylon/PlasticFinishing/RMStock')
);

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
