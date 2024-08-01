import { lazy } from "react";

// Issue
const Wastage = lazy(() => import("@/pages/Issue/Wastage"));
const OrderIssue = lazy(() => import("@/pages/Issue/History"));
const Maintenance = lazy(() => import("@/pages/Issue/Maintenance"));
const SpareParts = lazy(() => import("@/pages/Issue/SpareParts"));

export const IssueRoutes = [
	{
		id: 10,
		name: "History",
		path: "/issue/history",
		element: OrderIssue,
		type: "issue",
	},
	{
		id: 11,
		name: "Maintenance",
		path: "/issue/maintenance",
		element: Maintenance,
		type: "issue",
	},
	{
		id: 12,
		name: "Spare Parts",
		path: "/issue/spare-parts",
		element: SpareParts,
		type: "issue",
	},
	{
		id: 13,
		name: "Wastage",
		path: "/issue/wastage",
		element: Wastage,
		type: "issue",
	},
];
