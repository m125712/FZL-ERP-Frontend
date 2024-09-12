// * Dashboard
import SliderDashboardInfo from '@/pages/Slider/Dashboard/Info';

// * Coloring
import SliderColoringProduction from '@/pages/Slider/Coloring/Production';
import ColoringLog from '@/pages/Slider/Coloring/Log';

// * Die Casting
import DieCastingStock from '@/pages/Slider/DieCasting/Stock';
import DieCastingTransfer from '@/pages/Slider/DieCasting/Transfer';
import DieCastingTransferEntry from '@/pages/Slider/DieCasting/Transfer/Entry';
import DieCastingRMStock from '@/pages/Slider/DieCasting/RMStock';
import DieCastingLog from '@/pages/Slider/DieCasting/Log';

// * Slider Assembly
import SliderAssemblyLog from '@/pages/Slider/SliderAssembly/Log';
import SliderAssemblyProduction from '@/pages/Slider/SliderAssembly/Production';

// * Die Casting Entry
import DieCastingEntry from '@/pages/Slider/DieCasting/Production/Entry';
import DieCastingProduction from '@/pages/Slider/DieCasting/Production';
import DieCastingItemLibrary from '@/pages/Slider/DieCasting/ItemLibrary';

export const SliderRoutes = [
	{
		name: 'Slider',

		children: [
			// * Dashboard
			{
				name: 'Dashboard',
				children: [
					{
						name: 'Info',
						path: '/slider/dashboard/info',
						element: <SliderDashboardInfo />,
						page_name: 'slider__dashboard_info',
						actions: ['read', 'create', 'update', 'delete'],
					},
				],
			},

			// * Die Casting
			{
				name: 'Die Casting',
				children: [
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
						name: 'RM',
						path: '/slider/die-casting/rm',
						element: <DieCastingRMStock />,
						page_name: 'slider__die_casting_rm',
						actions: ['read', 'click_name', 'click_used'],
					},
					{
						name: 'Library',
						path: '/slider/die-casting/library',
						element: <DieCastingItemLibrary />,
						page_name: 'slider__die_casting_sfg',
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
						],
					},
					{
						name: 'Production',
						path: '/slider/die-casting/production',
						element: <DieCastingProduction />,
						page_name: 'slider__die_casting_production',
						actions: ['read', 'create', 'update', 'delete'],
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

			// * Slider Assembly
			{
				name: 'Slider Assembly',
				children: [
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
						actions: ['read', 'create', 'update', 'delete'],
					},
				],
			},

			// * Slider Coloring
			{
				name: 'Slider Coloring',
				children: [
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
						actions: ['read', 'create', 'update', 'delete'],
					},
				],
			},
		],
	},
];
