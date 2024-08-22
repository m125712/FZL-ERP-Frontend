import { lazy } from 'react';

// * Dashboard
// * Info
const SliderDashboardInfo = lazy(() => import('@/pages/Slider/Dashboard/Info'));

// Coloring
// const ColoringRMStock = lazy(
// 	() => import('@/pages/Slider/Coloring/RMStock/RMStock')
// );
// const ColoringLog = lazy(() => import('@/pages/Slider/Coloring/Log'));
// const ColoringSFG = lazy(() => import('@/pages/Slider/Coloring/SFG'));

// Die Casting

const DieCastingStock = lazy(() => import('@/pages/Slider/DieCasting/Stock'));

const DieCastingTransfer = lazy(
	() => import('@/pages/Slider/DieCasting/Transfer')
);

const DieCastingTransferEntry = lazy(
	() => import('@/pages/Slider/DieCasting/Transfer/Entry')
);

const DieCastingRMStock = lazy(
	() => import('@/pages/Slider/DieCasting/RMStock/RMStock')
);
const DieCastingLog = lazy(() => import('@/pages/Slider/DieCasting/Log'));
const DieCastingSFG = lazy(() => import('@/pages/Slider/DieCasting/SFG'));

// Slider Assembly
// const SliderAssemblyRMStock = lazy(
// 	() => import('@/pages/Slider/SliderAssembly/RMStock/RMStock')
// );
// const SliderAssemblyLog = lazy(
// 	() => import('@/pages/Slider/SliderAssembly/Log')
// );
// const SliderAssemblySFG = lazy(
// 	() => import('@/pages/Slider/SliderAssembly/SFG')
// );

// Die Casting Entry
const DieCastingEntry = lazy(
	() => import('@/pages/Slider/DieCasting/Production/Entry')
);
const DieCastingProduction = lazy(
	() => import('@/pages/Slider/DieCasting/Production')
);
// const DieCastingDetails = lazy(
// 	() => import('@/pages/Slider/DieCasting/Details')
// );
// const DieCastingBySliderDieCastingUUID = lazy(
// 	() => import('@/pages/Slider/DieCasting/Details/BySliderDieCastingUUID')
// );

const DieCastingItemLibrary = lazy(
	() => import('@/pages/Slider/DieCasting/ItemLibrary')
);

// Slider Assembly Entry
// const SliderAssemblyEntry = lazy(
// 	() => import('@/pages/Slider/SliderAssembly/Entry')
// );
// const SliderAssemblyDetails = lazy(
// 	() => import('@/pages/Slider/SliderAssembly/Details')
// );
// const SliderAssemblyBySliderSliderAssemblyUUID = lazy(
// 	() => import('@/pages/Slider/SliderAssembly/Details/BySliderAssemblyUUID')
// );
// const SliderAssemblyItemLibrary = lazy(
// 	() => import('@/pages/Slider/SliderAssembly/ItemLibrary')
// );

export const SliderRoutes = [
	{
		id: 21,
		name: 'Info',
		path: '/slider/dashboard/info',
		element: SliderDashboardInfo,
		type: ['slider', 'dashboard'],
		page_name: 'slider__dashboard_info',
		actions: ['read', 'create', 'update', 'delete'],
	},
	{
		id: 21,
		name: 'Stock',
		path: '/slider/die-casting/stock',
		element: DieCastingStock,
		type: ['slider', 'die-casting'],
		page_name: 'slider__die_casting_stock',
		actions: ['read', 'create', 'update', 'delete'],
	},
	{
		id: 21,
		name: 'Transfer',
		path: '/slider/die-casting/transfer',
		element: DieCastingTransfer,
		type: ['slider', 'die-casting'],
		page_name: 'slider__die_casting_transfer',
		actions: ['read', 'create', 'update', 'delete'],
	},
	{
		id: 21,
		name: 'Entry',
		path: '/slider/die-casting/transfer/entry',
		element: DieCastingTransferEntry,
		hidden: true,
		type: ['slider', 'die-casting'],
		page_name: 'slider__die_casting_transfer_entry',
		actions: ['read', 'create', 'update', 'delete'],
	},
	{
		id: 21,
		name: 'Update',
		path: '/slider/die-casting/transfer/update/:uuid',
		element: DieCastingTransfer,
		hidden: true,
		type: ['slider', 'die-casting'],
		page_name: 'slider__die_casting_transfer_update',
		actions: ['read', 'create', 'update', 'delete'],
	},
	{
		id: 21,
		name: 'RM',
		path: '/slider/die-casting/rm',
		element: DieCastingRMStock,
		type: ['slider', 'die-casting'],
		page_name: 'slider__die_casting_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 244,
		name: 'Library',
		path: '/slider/die-casting/library',
		element: DieCastingItemLibrary,
		type: ['slider', 'die-casting'],
		page_name: 'slider__die_casting_sfg',
		actions: ['read', 'create', 'update', 'delete'],
	},
	{
		id: 212,
		name: 'Log',
		path: '/slider/die-casting/log',
		element: DieCastingLog,
		type: ['slider', 'die-casting'],
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
		id: 24,
		name: 'Production',
		path: '/slider/die-casting/production',
		element: DieCastingProduction,
		type: ['slider', 'die-casting'],
		page_name: 'slider__die_casting_production',
		actions: ['read', 'create', 'update', 'delete'],
	},
	// {
	// 	id: 243,
	// 	name: 'In Details',
	// 	path: '/slider/die-casting/production/:slider_die_casting_uuid',
	// 	element: DieCastingProductionByUUID,
	// 	type: ['slider', 'die-casting'],
	// 	hidden: true,
	// 	page_name: 'slider__die_casting_details_by_uuid',
	// 	actions: ['read', 'update', 'delete'],
	// },
	{
		id: 241,
		name: 'Entry',
		path: '/slider/die-casting/production/entry',
		element: DieCastingEntry,
		type: ['slider', 'die-casting'],
		hidden: true,
		page_name: 'slider__die_casting_production_entry',
		actions: ['read', 'create', 'update', 'delete'],
	},
	// {
	// 	id: 243,
	// 	name: 'In Details',
	// 	path: '/slider/die-casting/production/:slider_die_casting_uuid',
	// 	element: DieCastingBySliderDieCastingUUID,
	// 	type: ['slider', 'die-casting'],
	// 	hidden: true,
	// 	page_name: 'slider__die_casting_details_by_uuid',
	// 	actions: ['read', 'update', 'delete'],
	// },
	// {
	// 	id: 241,
	// 	name: 'Entry',
	// 	path: '/slider/die-casting/entry',
	// 	element: DieCastingEntry,
	// 	type: ['slider', 'die-casting'],
	// 	hidden: true,
	// 	page_name: 'slider__die_casting_entry',
	// 	actions: ['read', 'create'],
	// },
	{
		id: 242,
		name: 'Update',
		path: '/slider/die-casting/production/update/:uuid',
		element: DieCastingEntry,
		type: ['slider', 'die-casting'],
		hidden: true,
		page_name: 'slider__die_casting_production_update',
		actions: ['read', 'update'],
	},
	// Slider Assembly
	// {
	// 	id: 22,
	// 	name: 'RM',
	// 	path: '/slider/slider-assembly/rm',
	// 	element: SliderAssemblyRMStock,
	// 	type: ['slider', 'slider-assembly'],
	// 	page_name: 'slider__assembly_rm',
	// 	actions: ['read', 'click_name', 'click_used'],
	// },
	// {
	// 	id: 221,
	// 	name: 'SFG',
	// 	path: '/slider/slider-assembly/sfg',
	// 	element: SliderAssemblySFG,
	// 	type: ['slider', 'slider-assembly'],
	// 	page_name: 'slider__assembly_sfg',
	// 	actions: ['read', 'click_production', 'click_to_coloring'],
	// },
	// {
	// 	id: 222,
	// 	name: 'Log',
	// 	path: '/slider/slider-assembly/log',
	// 	element: SliderAssemblyLog,
	// 	type: ['slider', 'slider-assembly'],
	// 	page_name: 'slider__assembly_log',
	// 	actions: [
	// 		'read',
	// 		'click_update_sfg',
	// 		'click_delete_sfg',
	// 		'click_update_rm',
	// 		'click_delete_rm',
	// 		'click_update_rm_order',
	// 		'click_delete_rm_order',
	// 	],
	// },

	// {
	// 	id: 25,
	// 	name: 'Production',
	// 	path: '/slider/slider-assembly/production',
	// 	element: SliderAssemblyDetails,
	// 	type: ['slider', 'slider-assembly'],
	// 	page_name: 'slider__assembly_details',
	// 	actions: ['read', 'create', 'update', 'delete'],
	// },
	// {
	// 	id: 253,
	// 	name: 'In Production',
	// 	path: '/slider/slider-assembly/production/:slider_slider_assembly_uuid',
	// 	element: SliderAssemblyBySliderSliderAssemblyUUID,
	// 	type: ['slider', 'slider-assembly'],
	// 	hidden: true,
	// 	page_name: 'slider__assembly_details_by_uuid',
	// 	actions: ['read'],
	// },
	// {
	// 	id: 251,
	// 	name: 'Entry',
	// 	path: '/slider/slider-assembly/entry',
	// 	element: SliderAssemblyEntry,
	// 	type: ['slider', 'slider-assembly'],
	// 	hidden: true,
	// 	page_name: 'slider__assembly_entry',
	// 	actions: ['read', 'create'],
	// },
	// {
	// 	id: 252,
	// 	name: 'Update',
	// 	path: '/slider/slider-assembly/update/:slider_slider_assembly_uuid',
	// 	element: SliderAssemblyEntry,
	// 	type: ['slider', 'slider-assembly'],
	// 	hidden: true,
	// 	page_name: 'slider__assembly_update',
	// 	actions: ['read', 'update'],
	// },
	// {
	// 	id: 254,
	// 	name: 'Item Stock',
	// 	path: '/slider/slider-assembly/item-stock', // item-library changed to item-stock
	// 	element: SliderAssemblyItemLibrary,
	// 	type: ['slider', 'slider-assembly'],
	// 	page_name: 'slider__assembly_item_library',
	// 	actions: ['read', 'create', 'update', 'delete', 'click_to_coloring'],
	// },
	// Coloring
	// {
	// 	id: 23,
	// 	name: 'RM',
	// 	path: '/slider/coloring/rm',
	// 	element: ColoringRMStock,
	// 	type: ['slider', 'coloring'],
	// 	page_name: 'slider__coloring_rm',
	// 	actions: ['read', 'click_name', 'click_used'],
	// },
	// {
	// 	id: 231,
	// 	name: 'SFG',
	// 	path: '/slider/coloring/sfg',
	// 	element: ColoringSFG,
	// 	type: ['slider', 'coloring'],
	// 	page_name: 'slider__coloring_sfg',
	// 	actions: ['read', 'click_production', 'click_to_coloring'],
	// },
	// {
	// 	id: 232,
	// 	name: 'Log',
	// 	path: '/slider/coloring/log',
	// 	element: ColoringLog,
	// 	type: ['slider', 'coloring'],
	// 	page_name: 'slider__coloring_log',
	// 	actions: [
	// 		'read',
	// 		'click_update_sfg',
	// 		'click_delete_sfg',
	// 		'click_update_rm',
	// 		'click_delete_rm',
	// 		'click_update_rm_order',
	// 		'click_delete_rm_order',
	// 	],
	// },
];
