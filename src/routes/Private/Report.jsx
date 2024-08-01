import { lazy } from "react";

// Report
const StockPerDay = lazy(() => import("@/pages/Report/StockPerDay"));
const StockDateRange = lazy(() => import("@/pages/Report/StockBetweenDays"));
const PurchaseDateRange = lazy(
	() => import("@pages/Report/PurchaseBetweenDays")
);
const Ledger = lazy(() => import("@/pages/Report/ItemLedgerSummary"));
const SampleReport = lazy(() => import("@/pages/Report/SampleReport"));

export const ReportRoutes = [
	{
		id: 18,
		name: "Stock",
		path: "/report/stock",
		element: StockDateRange,
		type: "report",
		page_name: "report__stock",
		actions: ["read"],
	},
	{
		id: 19,
		name: "Purchase",
		path: "/report/purchase",
		element: PurchaseDateRange,
		type: "report",
		page_name: "report__purchase",
		actions: ["read"],
	},
	{
		id: 20,
		name: "Ledger",
		path: "/report/ledger",
		element: Ledger,
		type: "report",
		page_name: "report__ledger",
		actions: ["read"],
	},
	{
		id: 21,
		name: "Sample",
		path: "/report/sample",
		element: SampleReport,
		type: "report",
		page_name: "report__sample",
		actions: ["read"],
	},
];
