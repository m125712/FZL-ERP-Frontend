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
// * RM
export const useLabDipRM = () =>
	createGlobalState({
		queryKey: labDipQK.LabDipRM(),
		url: `/material/stock/by/single-field/lab_dip`,
	});
export const useLabDipRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: labDipQK.LabDipRM(uuid),
		url: `/material/stock/by/single-field/lab_dip/${uuid}`,
	});
// * RM Log
export const useLabDipRMLog = () =>
	createGlobalState({
		queryKey: labDipQK.LabDipRMLog(),
		url: `/material/used/by/lab_dip`,
	});
export const useLabDipRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: labDipQK.LabDipRMLog(uuid),
		url: `/material/used/by/lab_dip${uuid}`,
	});
// * Order Against RM Log
export const useOrderAgainstLabDipRMLog = () =>
	createGlobalState({
		queryKey: labDipQK.orderAgainstLabDipRMLog(),
		url: `/zipper/material-trx-against-order/by/lab_dip`,
	});
export const useOrderAgainstLabDipRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: labDipQK.orderAgainstLabDipRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/lab_dip${uuid}`,
	});