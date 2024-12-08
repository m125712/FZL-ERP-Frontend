import { lazy } from 'react';

const Log = lazy(() => import('@pages/LabDip/Log'));
const RM = lazy(() => import('@pages/LabDip/RM'));
const Info = lazy(() => import('@pages/LabDip/Info'));
const InfoDetails = lazy(() => import('@pages/LabDip/Info/ByUUID'));
const InfoEntry = lazy(() => import('@pages/LabDip/Info/Entry'));
const Recipe = lazy(() => import('@pages/LabDip/Recipe'));
const RecipeDetails = lazy(() => import('@pages/LabDip/Recipe/ByRecipeId'));
const RecipeEntry = lazy(() => import('@pages/LabDip/Recipe/Entry'));
const ShadeRecipe = lazy(() => import('@pages/LabDip/ShadeRecipe'));
const ShadeRecipeDetails = lazy(
	() => import('@pages/LabDip/ShadeRecipe/Details/ByShadeRecipeId')
);
const ShadeRecipeEntry = lazy(() => import('@pages/LabDip/ShadeRecipe/Entry'));
const ThreadSwatch = lazy(() => import('@pages/LabDip/ThreadSwatch'));
const ZipperSwatch = lazy(() => import('@pages/LabDip/ZipperSwatch'));

export const LabDipRoutes = [
	{
		name: 'Lab Dip',
		children: [
			{
				name: 'RM',
				path: '/lab-dip/rm',
				element: <RM />,
				page_name: 'lab_dip__rm',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_name',
					'click_used',
				],
				isDynamic: true,
			},
			{
				name: 'Card',
				path: '/lab-dip/info',
				element: <Info />,
				page_name: 'lab_dip__info',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_status',
					'click_status_override',
				],
			},
			{
				name: 'Info Entry',
				path: '/lab-dip/info/entry',
				element: <InfoEntry />,
				hidden: true,
				page_name: 'lab_dip__info_entry',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Info Update',
				path: '/lab-dip/info/:info_number/:info_uuid/update',
				element: <InfoEntry />,
				page_name: 'lab_dip__info_entry_update',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
				isDynamic: true,
			},
			{
				name: 'Info Details',
				path: '/lab-dip/info/details/:info_uuid',
				element: <InfoDetails />,
				hidden: true,
				page_name: 'lab_dip__info_details',
				actions: ['read', 'update'],
				isDynamic: true,
			},
			{
				name: 'Recipe',
				path: '/lab-dip/recipe',
				element: <Recipe />,
				page_name: 'lab_dip__recipe',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_approve',
					'click_approve_override',
					'click_status',
					'click_status_override',
				],
			},
			{
				name: 'Recipe Entry',
				path: '/lab-dip/recipe/entry',
				element: <RecipeEntry />,
				hidden: true,
				page_name: 'lab_dip__recipe_entry',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Recipe Update',
				path: '/lab-dip/recipe/:recipe_id/:recipe_uuid/update',
				element: <RecipeEntry />,
				page_name: 'lab_dip__recipe_entry_update',
				hidden: true,
				actions: ['create', 'read', 'update', 'delete'],
				isDynamic: true,
			},
			{
				name: 'Recipe Details',
				path: '/lab-dip/recipe/details/:recipe_uuid',
				element: <RecipeDetails />,
				hidden: true,
				page_name: 'lab_dip__recipe_details',
				actions: ['create', 'read', 'update', 'delete'],
				isDynamic: true,
			},

			// {
			// 	name: 'Shade Recipe Entry',
			// 	path: '/lab-dip/shade_recipe/entry',
			// 	element: <ShadeRecipeEntry />,
			// 	hidden: true,
			// 	page_name: 'lab_dip__shade_recipe_entry',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// },
			// {
			// 	name: 'Shade Recipe Details',
			// 	path: '/lab-dip/shade_recipe/:shade_recipe_uuid',
			// 	element: <ShadeRecipeDetails />,
			// 	hidden: true,
			// 	page_name: 'lab_dip__shade_recipe_details',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// },
			// {
			// 	name: 'Shade Recipe',
			// 	path: '/lab-dip/shade_recipe',
			// 	element: <ShadeRecipe />,
			// 	page_name: 'lab_dip__shade_recipe',
			// 	actions: ['create', 'read', 'update', 'delete'],
			// },
			// {
			// 	name: 'Shade Recipe Update',
			// 	path: '/lab-dip/shade_recipe/:shade_recipe_uuid/update',
			// 	element: <ShadeRecipeEntry />,
			// 	page_name: 'lab_dip__shade_recipe_entry_update',
			// 	hidden: true,
			// 	actions: ['create', 'read', 'update', 'delete'],
			// 	isDynamic: true,
			// },
			{
				name: 'Zipper Swatch',
				path: '/lab-dip/zipper-swatch',
				element: <ZipperSwatch />,
				page_name: 'lab_dip__zipper_swatch',
				actions: [
					'read',
					'update',
					'click_swatch_status',
					'click_swatch_status_override',
				],
			},
			{
				name: 'Thread Swatch',
				path: '/lab-dip/thread-swatch',
				element: <ThreadSwatch />,
				page_name: 'lab_dip__thread_swatch',
				actions: [
					'read',
					'update',
					'click_swatch_status',
					'click_swatch_status_override',
				],
			},
			{
				name: 'Log',
				path: '/lab-dip/log',
				element: <Log />,
				page_name: 'lab_dip__log',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_name',
					'click_used',
					'click_update_rm_order',
					'click_delete_rm_order',
				],
				isDynamic: true,
			},
		],
	},
];
