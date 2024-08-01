import { hi } from "date-fns/locale";
import { lazy } from "react";

// CountLength
const CountLength = lazy(() => import("@pages/Thread/CountLength"));
// ShadeRecipe
const ShadeRecipeDetails = lazy(() => import("@pages/Thread/ShadeRecipe"));
const IndShadeRecipeDetails = lazy(
	() => import("@pages/Thread/ShadeRecipe/Details")
);
const ShadeRecipeEntry = lazy(() => import("@pages/Thread/ShadeRecipe/Entry"));
//Order
const OrderInfo = lazy(() => import("@pages/Thread/Order"));
const IndOrderInfo = lazy(() => import("@pages/Thread/Order/Details"));
const OrderInfoEntry = lazy(() => import("@pages/Thread/Order/Entry"));

export const ThreadRoutes = [
	{
		id: 1,
		name: "Count Length",
		path: "/thread/count-length",
		element: CountLength,
		type: "thread",
		page_name: "thread__count_length",
		actions: ["create", "read", "update", "delete"],
	},
	{
		id: 2,
		name: "Shade Recipe",
		path: "/thread/shade-recipe/details",
		element: ShadeRecipeDetails,
		type: "thread",
		page_name: "thread__shade_recipe_details",
		actions: ["create", "read", "update", "delete"],
	},
	{
		id: 21,
		name: "Entry",
		path: "/thread/shade-recipe/entry",
		element: ShadeRecipeEntry,
		type: "thread",
		page_name: "thread__shade_recipe_entry",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
	{
		id: 22,
		name: "Update",
		path: "/thread/shade-recipe/update/:id/:thread_shade_recipe_uuid",
		element: ShadeRecipeEntry,
		type: "thread",
		page_name: "thread__shade_recipe_update",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
	{
		id: 23,
		name: "Details of Shade Recipe",
		path: "/thread/shade-recipe/details/:id/:thread_shade_recipe_uuid",
		element: IndShadeRecipeDetails,
		type: "thread",
		page_name: "thread__shade_recipe_in_details",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
	{
		id: 3,
		name: "Order Info",
		path: "/thread/order-info/details",
		element: OrderInfo,
		type: "thread",
		page_name: "thread__order_info_details",
		actions: ["create", "read", "update", "delete"],
	},
	{
		id: 31,
		name: "Entry",
		path: "/thread/order-info/entry",
		element: OrderInfoEntry,
		type: "thread",
		page_name: "thread__order_info_entry",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
	{
		id: 32,
		name: "Update",
		path: "/thread/order-info/update/:id/:thread_order_info_uuid",
		element: OrderInfoEntry,
		type: "thread",
		page_name: "thread__order_info_update",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
	{
		id: 33,
		name: "Details of Order Info",
		path: "/thread/order-info/details/:id/:thread_order_info_uuid",
		element: IndOrderInfo,
		type: "thread",
		page_name: "thread__order_info_in_details",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
];
