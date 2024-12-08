import { lazy } from 'react';

const VislonFinishingTrxLog = lazy(
	() => import('@/pages/Vislon/Finishing/Log')
);
const VislonFinishingProduction = lazy(
	() => import('@/pages/Vislon/Finishing/Production')
);
const VislonFinishing = lazy(() => import('@/pages/Vislon/Finishing/RMStock'));
const VislonTeethMoldingTrxLog = lazy(
	() => import('@/pages/Vislon/TeethMolding/Log')
);
const VislonProduction = lazy(
	() => import('@/pages/Vislon/TeethMolding/Production')
);
const VislonTeethMolding = lazy(
	() => import('@/pages/Vislon/TeethMolding/RMStock')
);

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
						name: 'Production',
						path: '/vislon/teeth-molding/production',
						element: <VislonProduction />,
						page_name: 'vislon__teeth_molding_production',
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
						path: '/vislon/teeth-molding/log',
						element: <VislonTeethMoldingTrxLog />,
						page_name: 'vislon__teeth_molding_log',
						actions: ['read', 'create', 'delete', 'update'],
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
						name: 'Production',
						path: '/vislon/finishing/production',
						element: <VislonFinishingProduction />,
						page_name: 'vislon__finishing_production',
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
						path: '/vislon/finishing/log',
						element: <VislonFinishingTrxLog />,
						page_name: 'vislon__finishing_log',
						actions: ['read', 'create', 'delete', 'update'],
					},
				],
			},
		],
	},
];
