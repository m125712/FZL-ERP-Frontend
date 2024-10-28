import createGlobalState from '.';
import { nylonQK } from './QueryKeys';

//* Metallic Finishing
// * Production
export const useNylonMFProduction = (enabled = true) =>
	createGlobalState({
		queryKey: nylonQK.nylonMFProduction(),
		url: '/zipper/sfg/by/finishing_prod?item_name=nylon&nylon_stopper=metallic',
		enabled: enabled,
	});

//* Production Log
export const useNylonMFProductionLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonMFProductionLog(),
		url: '/zipper/sfg-production/by/finishing?item_name=nylon&nylon_stopper=metallic',
	});

export const useNylonMFProductionLogByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: nylonQK.nylonMFProductionLogByUUID(uuid),
		url: `/zipper/sfg-production/${uuid}`,
		enabled: enabled,
	});

//* Trx Log
export const useNylonMFTrxLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonMFTrxLog(),
		url: '/zipper/sfg-transaction/by/finishing_prod?item_name=nylon&nylon_stopper=metallic',
	});

export const useNylonMFTrxLogByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: nylonQK.nylonMFTrxLogByUUID(uuid),
		url: `/zipper/sfg-transaction/${uuid}`,
		enabled: enabled,
	});

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
		url: '/zipper/dyed-tape-transaction/by/nylon?nylon_stopper=metallic',
	});
export const useNylonMetallicFinishingTapeLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: nylonQK.nylonMetallicTapeLogByUUID(uuid),
		url: `/zipper/dyed-tape-transaction/by/nylon_metallic_finishing/${uuid}`,
	});

//*Plastic Finishing
//*Tape Log
export const useNylonPlasticFinishingTapeLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingTapeLog(),
		url: '/zipper/dyed-tape-transaction/by/nylon?nylon_stopper=plastic',
	});
export const useNylonPlasticFinishingTapeLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingTapeLogByUUID(uuid),
		url: `/zipper/dyed-tape-transaction/by/nylon_plastic_finishing/${uuid}`,
	});

//* Production Log
export const useNylonPlasticFinishingProductionLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingProductionLog(),
		url: '/zipper/sfg-production/by/finishing?item_name=nylon&stopper_type=plastic stopper',
	});
export const useNylonPlasticFinishingProductionLogByUUID = (
	uuid,
	{ enabled = true }
) =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingProductionLogByUUID(uuid),
		url: `/zipper/sfg-production/${uuid}`,
		enabled: enabled,
	});

//* Trx Log
export const useNylonPlasticFinishingTrxLog = () =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingTrxLog(),
		url: '/zipper/sfg-transaction/by/finishing_prod?item_name=nylon&stopper_type=plastic stopper',
	});

export const useNylonPlasticFinishingTrxLogByUUID = (
	uuid,
	{ enabled = true }
) =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticFinishingTrxLogByUUID(uuid),
		url: `/zipper/sfg-transaction/${uuid}`,
		enabled: enabled,
	});

// * PRODUCTION
export const useNylonPlasticFinishingProduction = () =>
	createGlobalState({
		queryKey: nylonQK.nylonPlasticProduction(),
		url: '/zipper/sfg/by/finishing_prod?item_name=nylon&nylon_stopper=plastic',
	});
