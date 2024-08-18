import createGlobalState from '.';
import { nylonQK } from './QueryKeys';

//* Metallic Finishing
// * RM
export const useNylonMetallicFinishingRM = () =>
	createGlobalState({
		queryKey: nylonQK.nylonMetallicFinishingRM(),
		url: '/material/stock/by/multi-field/n_t_cutting,n_stopper',
	});
export const useNylonMetallicFinishingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: nylonQK.nylonMetallicFinishingRMByUUID(uuid),
		url: `/material/stock/by/multi-field/n_t_cutting,n_stopper/${uuid}`,
	});
//* RM Log
export const useNylonMetallicFinishingRMLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonMetallicFinishingRMLog(),
		url: '/material/used/multi-section/by/n_t_cutting,n_stopper',
	});
export const useNylonMetallicFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: nylonQK.nylonMetallicFinishingRMLogByUUID(uuid),
		url: `/material/used/multi-section/by/n_t_cutting,n_stopper/${uuid}`,
	});
