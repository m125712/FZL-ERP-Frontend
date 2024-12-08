import { lazy } from 'react';

const ColoringLog = lazy(() => import('@/pages/Slider/Coloring/Log'));
const SliderColoringProduction = lazy(
	() => import('@/pages/Slider/Coloring/Production')
);
const ColoringRM = lazy(() => import('@/pages/Slider/Coloring/RMStock'));
const SliderDashboard = lazy(() => import('@/pages/Slider/Dashboard'));

const DieCastingLog = lazy(() => import('@/pages/Slider/DieCasting/Log'));
const DieCastingProduction = lazy(
	() => import('@/pages/Slider/DieCasting/Production')
);
const DieCastingEntry = lazy(
	() => import('@/pages/Slider/DieCasting/Production/Entry')
);
const DieCastingRMStock = lazy(
	() => import('@/pages/Slider/DieCasting/RMStock')
);
const DieCastingStock = lazy(() => import('@/pages/Slider/DieCasting/Stock'));
const DieCastingTransfer = lazy(
	() => import('@/pages/Slider/DieCasting/Transfer')
);
const DieCastingTransferEntry = lazy(
	() => import('@/pages/Slider/DieCasting/Transfer/Entry')
);

const SliderAssemblyLog = lazy(
	() => import('@/pages/Slider/SliderAssembly/Log')
);
const SliderAssemblyProduction = lazy(
	() => import('@/pages/Slider/SliderAssembly/Production')
);
const SliderAssemblyRM = lazy(
	() => import('@/pages/Slider/SliderAssembly/RMStock')
);
const SliderAssemblyStock = lazy(
	() => import('@/pages/Slider/SliderAssembly/Stock')
);

export const SliderRoutes = [
	{
		name: 'Slider',

		children: [
			// * Dashboard
			{
				name: 'Dashboard',
				path: '/slider/dashboard',
				element: <SliderDashboard />,
				page_name: 'slider__dashboard',
				actions: ['read', 'create', 'update', 'delete'],
			},

			// * Die Casting
			{
				name: 'Die Casting',
				children: [
					{
						name: 'RM',
						path: '/slider/die-casting/rm',
						element: <DieCastingRMStock />,
						page_name: 'slider__die_casting_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'Production',
						path: '/slider/die-casting/production',
						element: <DieCastingProduction />,
						page_name: 'slider__die_casting_production',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Stock',
						path: '/slider/die-casting/stock',
						element: <DieCastingStock />,
						page_name: 'slider__die_casting_stock',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Transfer',
						path: '/slider/die-casting/transfer',
						element: <DieCastingTransfer />,
						page_name: 'slider__die_casting_transfer',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Entry',
						path: '/slider/die-casting/transfer/entry',
						element: <DieCastingTransferEntry />,
						hidden: true,
						page_name: 'slider__die_casting_transfer_entry',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Update',
						path: '/slider/die-casting/transfer/:uuid/update',
						element: <DieCastingTransfer />,
						hidden: true,
						page_name: 'slider__die_casting_transfer_update',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Log',
						path: '/slider/die-casting/log',
						element: <DieCastingLog />,
						page_name: 'slider__die_casting_log',
						actions: [
							'read',
							'update',
							'delete',
							'click_update_rm_order',
							'click_delete_rm_order',
							'click_update_rm',
							'click_delete_rm',
						],
					},

					{
						name: 'Entry',
						path: '/slider/die-casting/production/entry',
						element: <DieCastingEntry />,
						hidden: true,
						page_name: 'slider__die_casting_production_entry',
						actions: ['read', 'create', 'update', 'delete'],
					},

					{
						name: 'Update',
						path: '/slider/die-casting/production/:uuid/update',
						element: <DieCastingEntry />,
						hidden: true,
						page_name: 'slider__die_casting_production_update',
						actions: ['read', 'update'],
					},
				],
			},

			// *  Assembly
			{
				name: 'Assembly',
				children: [
					{
						name: 'RM',
						path: '/slider/slider-assembly/rm',
						element: <SliderAssemblyRM />,
						page_name: 'slider__assembly_rm',
						actions: [
							'read',
							'create',
							'update',
							'delete',
							'click_used',
						],
					},
					{
						name: 'Stock',
						path: '/slider/slider-assembly/stock',
						element: <SliderAssemblyStock />,
						page_name: 'slider__assembly_stock',
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
						name: 'Production',
						path: '/slider/slider-assembly/production',
						element: <SliderAssemblyProduction />,
						page_name: 'slider__assembly_production',
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
						path: '/slider/slider-assembly/log',
						element: <SliderAssemblyLog />,
						page_name: 'slider__assembly_log',
						actions: [
							'read',
							'create',
							'update',
							'delete',
							'click_update_rm',
							'click_delete_rm',
						],
					},
				],
			},

			// * Slider Coloring
			{
				name: 'Coloring',
				children: [
					{
						name: 'RM',
						path: '/slider/slider-coloring/rm',
						element: <ColoringRM />,
						page_name: 'slider__coloring_rm',
						actions: [
							'read',
							'create',
							'update',
							'delete',
							'click_used',
						],
					},
					{
						name: 'Production',
						path: '/slider/slider-coloring/production',
						element: <SliderColoringProduction />,
						page_name: 'slider__coloring_production',
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
						path: '/slider/slider-coloring/log',
						element: <ColoringLog />,
						page_name: 'slider__coloring_log',
						actions: [
							'read',
							'create',
							'update',
							'delete',
							'click_update_rm',
							'click_delete_rm',
						],
					},
				],
			},
		],
	},
];
