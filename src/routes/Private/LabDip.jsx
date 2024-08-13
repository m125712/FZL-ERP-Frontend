import { lazy } from 'react';

// Pages
const Recipe = lazy(() => import('@pages/LabDip/Recipe'));
const RecipeEntry = lazy(() => import('@pages/LabDip/Recipe/Entry'));

export const LabDipRoutes = [
	{
		id: 1,
		name: 'Recipe',
		path: '/lab-dip/recipe',
		element: Recipe,
		type: 'lab_dip',
		page_name: 'lab_dip__recipe',
		actions: [
			'create',
			'read',
			'update',
			'delete',
			'click_status',
			'click_reset_password',
			'click_page_assign',
		],
	},
	{
		id: 15,
		name: 'Entry',
		path: '/lab-dip/recipe/entry',
		element: RecipeEntry,
		type: 'lab_dip',
		hidden: true,
		page_name: 'lab_dip__recipe_entry',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 151,
		name: 'Recipe Update',
		path: '/lab-dip/recipe/update/:recipe_id/:recipe_uuid',
		element: RecipeEntry,
		page_name: 'lab_dip__recipe_entry_update',
		hidden: true,
		actions: ['create', 'read', 'update', 'delete'],
		isDynamic: true,
	},
];
