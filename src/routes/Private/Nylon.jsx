import { lazy } from "react";

//MetallicFinishing
const NylonMetallicFinishing = lazy(
	() => import("@/pages/Nylon/MetallicFinishing/RMStock/RMStock")
);
const NylonMetallicFinishingSFG = lazy(
	() => import("@/pages/Nylon/MetallicFinishing/SFG")
);
const NylonMetallicFinishingTrxLog = lazy(
	() => import("@/pages/Nylon/MetallicFinishing/Log")
);

// Hole Punch
const NylonPlasticFinishing = lazy(
	() => import("@/pages/Nylon/PlasticFinishing/RMStock/RMStock")
);
const NylonPlasticFinishingSFG = lazy(
	() => import("@/pages/Nylon/PlasticFinishing/SFG")
);
const NylonPlasticFinishingTrxLog = lazy(
	() => import("@/pages/Nylon/PlasticFinishing/Log")
);

export const NylonRoutes = [
	{
		id: 37,
		name: 'RM',
		path: '/nylon/metallic-finishing/rm',
		element: NylonMetallicFinishing,
		type: ['nylon', 'metallic-finishing'],
		page_name: 'nylon__metallic_finishing_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 371,
		name: 'SFG',
		path: '/nylon/metallic-finishing/sfg',
		element: NylonMetallicFinishingSFG,
		type: ['nylon', 'metallic-finishing'],
		page_name: 'nylon__metallic_finishing_sfg',
		actions: ['read', 'click_production'],
	},
	{
		id: 372,
		name: 'Log',
		path: '/nylon/metallic-finishing/log',
		element: NylonMetallicFinishingTrxLog,
		type: ['nylon', 'metallic-finishing'],
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
		id: 38,
		name: 'RM',
		path: '/nylon/plastic-finishing/rm',
		element: NylonPlasticFinishing,
		type: ['nylon', 'plastic-finishing'],
		page_name: 'nylon__plastic_finishing_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 381,
		name: 'SFG',
		path: '/nylon/plastic-finishing/sfg',
		element: NylonPlasticFinishingSFG,
		type: ['nylon', 'plastic-finishing'],
		page_name: 'nylon__plastic_finishing_sfg',
		actions: ['read', 'click_production'],
	},
	{
		id: 382,
		name: 'Log',
		path: '/nylon/plastic-finishing/log',
		element: NylonPlasticFinishingTrxLog,
		type: ['nylon', 'plastic-finishing'],
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
];
