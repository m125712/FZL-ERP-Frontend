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
// * Order Against RM Log
export const useOrderAgainstNylonMetallicFinishingRMLog = () =>
	createGlobalState({
		queryKey: nylonQK.orderAgainstNylonFinishingRMLog(),
		url: '/zipper/material-trx-against-order/multiple/by/n_t_cutting,n_stopper',
	});
export const useOrderAgainstNylonMetallicFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: nylonQK.orderAgainstNylonFinishingRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/multiple/by/n_t_cutting,n_stopper${uuid}`,
	});

// * Tape Log
export const useNylonMetallicFinishingTapeLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonMetallicTapeLog(),
		url: '/zipper/dyed-tape-transaction/by/nylon_metallic_finishing',
	});
export const useNylonMetallicFinishingTapeLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: nylonQK.nylonMetallicTapeLogByUUID(uuid),
		url: `/zipper/dyed-tape-transaction/by/nylon_metallic_finishing${uuid}`,
	});

//*Plastic Finishing
//*Tape Log
export const useNylonPlasticFinishingTapeLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingTapeLog(),
		url: '/zipper/dyed-tape-transaction/by/nylon_plastic_finishing',
	});
export const useNylonPlasticFinishingTapeLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingTapeLogByUUID(uuid),
		url: `/zipper/dyed-tape-transaction/by/nylon_plastic_finishing${uuid}`,
	});
