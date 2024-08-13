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

// * Info
export const useLabDipInfo = () =>
	createGlobalState({
		queryKey: labDipQK.info(),
		url: '/lab-dip/info',
	});

export const useLabDipInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: labDipQK.infoByUUID(uuid),
		url: `/lab-dip/info/${uuid}`,
	});
