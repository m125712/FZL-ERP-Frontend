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
				name: 'Making',
				children: [
					{
						name: 'RM 1',
						path: '/slider/making/rm_1',
						element: <DieCastingRMStock />,
						page_name: 'slider__making_rm_1',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'RM 2',
						path: '/slider/making/rm_2',
						element: <SliderAssemblyRM />,
						page_name: 'slider__making_rm_2',
						actions: [
							'read',
							'create',
							'update',
							'delete',
							'click_used',
						],
					},
					{
						name: 'Production 1',
						path: '/slider/making/production_1',
						element: <DieCastingProduction />,
						page_name: 'slider__making_production_1',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Entry',
						path: '/slider/making/production_1/entry',
						element: <DieCastingEntry />,
						hidden: true,
						page_name: 'slider__making_production_1_entry',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Update',
						path: '/slider/making/production_1/:uuid/update',
						element: <DieCastingEntry />,
						hidden: true,
						page_name: 'slider__making_production_1_update',
						actions: ['read', 'update'],
					},
					{
						name: 'Production 2',
						path: '/slider/making/production_2',
						element: <SliderAssemblyProduction />,
						page_name: 'slider__making_production_2',
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
						name: 'Stock 1',
						path: '/slider/making/stock_1',
						element: <DieCastingStock />,
						page_name: 'slider__making_stock_1',
						actions: ['read', 'create', 'update', 'delete'],
					},
					{
						name: 'Stock 2',
						path: '/slider/making/stock_2',
						element: <SliderAssemblyStock />,
						page_name: 'slider__making_stock_2',
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
						name: 'Log 1',
						path: '/slider/making/log_1',
						element: <DieCastingLog />,
						page_name: 'slider__making_log_1',
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
						name: 'Log 2',
						path: '/slider/making/log_2',
						element: <SliderAssemblyLog />,
						page_name: 'slider__making_log_2',
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
