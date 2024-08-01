import { lazy } from "react";

// Teeth Molding
const VislonTeethMolding = lazy(
	() => import("@/pages/Vislon/TeethMolding/RMStock/RMStock")
);
const VislonTeethMoldingSFG = lazy(
	() => import("@/pages/Vislon/TeethMolding/SFG")
);
const VislonTeethMoldingTrxLog = lazy(
	() => import("@/pages/Vislon/TeethMolding/Log")
);

// Finishing
const VislonFinishing = lazy(
	() => import("@/pages/Vislon/Finishing/RMStock/RMStock")
);
const VislonFinishingSFG = lazy(() => import("@/pages/Vislon/Finishing/SFG"));
const VislonFinishingTrxLog = lazy(
	() => import("@/pages/Vislon/Finishing/Log")
);

export const VislonRoutes = [
	{
		id: 41,
		name: "RM",
		path: "/vislon/teeth-molding/rm",
		element: VislonTeethMolding,
		type: ["vislon", "teeth-molding"],
		page_name: "vislon__teeth_molding_rm",
		actions: ["read", "click_name", "click_used"],
	},
	{
		id: 411,
		name: "SFG",
		path: "/vislon/teeth-molding/sfg",
		element: VislonTeethMoldingSFG,
		type: ["vislon", "teeth-molding"],
		page_name: "vislon__teeth_molding_sfg",
		actions: ["read", "click_production", "click_to_finishing"],
	},
	{
		id: 412,
		name: "Log",
		path: "/vislon/teeth-molding/log",
		element: VislonTeethMoldingTrxLog,
		type: ["vislon", "teeth-molding"],
		page_name: "vislon__teeth_molding_log",
		actions: [
			"read",
			"click_update_sfg",
			"click_delete_sfg",
			"click_update_rm",
			"click_delete_rm",
		],
	},
	{
		id: 42,
		name: "RM",
		path: "/vislon/finishing/rm",
		element: VislonFinishing,
		type: ["vislon", "finishing"],
		page_name: "vislon__finishing_rm",
		actions: ["read", "click_name", "click_used"],
	},
	{
		id: 421,
		name: "SFG",
		path: "/vislon/finishing/sfg",
		element: VislonFinishingSFG,
		type: ["vislon", "finishing"],
		page_name: "vislon__finishing_sfg",
		actions: ["read", "click_production"],
	},
	{
		id: 422,
		name: "Log",
		path: "/vislon/finishing/log",
		element: VislonFinishingTrxLog,
		type: ["vislon", "finishing"],
		page_name: "vislon__finishing_log",
		actions: [
			"read",
			"click_update_sfg",
			"click_delete_sfg",
			"click_update_rm",
			"click_delete_rm",
		],
	},
];
