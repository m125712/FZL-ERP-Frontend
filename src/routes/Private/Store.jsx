import { lazy } from "react";

// Pages
// Material
const Stock = lazy(() => import("@/pages/Material/Stock"));
const Details = lazy(() => import("@/pages/Material/Details"));
const Section = lazy(() => import("@/pages/Material/Section"));
const MaterialType = lazy(() => import("@/pages/Material/Type"));
const Summary = lazy(() => import("@/pages/Material/Summary"));
const MaterialLog = lazy(() => import("@/pages/Material/Log"));
// Purchase
const Vendor = lazy(() => import("@/pages/Purchase/Vendor"));
const Purchase = lazy(() => import("@/pages/Purchase/Details"));
const PurchaseEntry = lazy(() => import("@/pages/Purchase/Entry"));
const PurchaseInd = lazy(
	() => import("@/pages/Purchase/Details/ByPurchaseDescriptionUUID")
);

export const StoreRoutes = [
	{
		id: 4,
		name: "Stock",
		path: "/store/details",
		element: Details,
		type: "store",
		page_name: "store__stock",
		actions: [
			"create",
			"read",
			"update",
			"delete",
			"click_trx_against_order",
			"click_action",
		],
	},
	{
		id: 30,
		name: "Stock Full",
		path: "/store/stock",
		element: Stock,
		type: "store",
		page_name: "store__stock_full",
		actions: [
			"read",
			"click_name",
			"click_action",
			"click_trx_against_order",
		],
	},
	{
		id: 301,
		name: "Log",
		path: "/store/log",
		element: MaterialLog,
		type: "store",
		page_name: "store__log",
		actions: [
			"read",
			"update_log",
			"delete_log",
			"update_log_against_order",
			"delete_log_against_order",
		],
	},
	{
		id: 401,
		name: "Summary",
		path: "/material/:material_id",
		element: Summary,
		type: "store",
		hidden: true,
	},
	{
		if: 5,
		name: "Section",
		path: "/store/section",
		element: Section,
		type: "store",
		page_name: "store__section",
		actions: ["create", "read", "update", "delete"],
	},
	{
		id: 6,
		name: "Type",
		path: "/store/type",
		element: MaterialType,
		type: "store",
		page_name: "store__type",
		actions: ["create", "read", "update", "delete"],
	},
	{
		id: 9,
		name: "Vendor",
		path: "/store/vendor",
		element: Vendor,
		type: "store",
		page_name: "store__vendor",
		actions: ["create", "read", "update", "delete"],
	},
	{
		id: 7,
		name: "Receive",
		path: "/store/receive",
		element: Purchase,
		type: "store",
		page_name: "store__receive",
		actions: ["create", "read", "update"],
	},
	{
		id: 71,
		name: "Details",
		path: "/store/receive/:purchase_description_uuid",
		element: PurchaseInd,
		type: "store",
		hidden: true,
		page_name: "store__receive_by_uuid",
		actions: ["create", "read", "update"],
	},

	{
		id: 10,
		name: "Entry",
		path: "/store/receive/entry",
		element: PurchaseEntry,
		type: "store",
		hidden: true,
		page_name: "store__receive_entry",
		actions: ["create", "read", "update"],
	},
	{
		id: 10,
		name: "Entry",
		path: "/store/receive/update/:id/:purchase_description_uuid",
		element: PurchaseEntry,
		type: "store",
		hidden: true,
		page_name: "store__receive_update",
		actions: ["create", "read", "update"],
	},
];
