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
