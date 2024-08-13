import createGlobalState from '@/state';
import { labDipQK } from './QueryKeys';

export const useLabDipRecipe = () =>
	createGlobalState({
		queryKey: labDipQK.recipe(),
		url: '/lab-dip/recipe',
	});

export const useLabDipRecipeByUUID = (uuid) =>
	createGlobalState({
		queryKey: labDipQK.recipeByUUID(uuid),
		url: `/lab-dip/recipe/${uuid}`,
	});
