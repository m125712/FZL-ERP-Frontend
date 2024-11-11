import createGlobalState from '.';
import { vislonQK } from './QueryKeys';

// ! Teeth Molding
// * RM
export const useVislonTMRM = () =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRM(),
		url: '/material/stock/by/single-field/v_teeth_molding',
	});
export const useVislonTMRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRMByUUID(uuid),
		url: `/material/stock/by/single-field/v_teeth_molding${uuid}`,
	});

//* RM Log
export const useVislonTMRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRMLog(),
		url: '/material/used/by/v_teeth_molding',
	});
export const useVislonTMRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRMLogByUUID(uuid),
		url: `/material/used/by/v_teeth_molding${uuid}`,
	});

//* order against RM Log
export const useOrderAgainstVislonTMRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonTMRMLog(),
		url: '/zipper/material-trx-against-order/by/v_teeth_molding',
	});
export const useOrderAgainstVislonTMRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonTMRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/v_teeth_molding${uuid}`,
	});

// * Production & Transaction combined data
export const useVislonTMP = () =>
	createGlobalState({
		queryKey: vislonQK.vislonTMP(),
		url: '/zipper/finishing-batch-entry/by/teeth_molding_prod?item_name=vislon',
	});

// * Production Entry by UUID
export const useVislonTMPEntryByUUID = (uuid) => {
	return createGlobalState({
		queryKey: vislonQK.vislonTMPEntryByUUID(uuid),
		url: `/zipper/finishing-batch-production/${uuid}`,
	});
};

// * Transaction Entry by UUID
export const useVislonTMTEntryByUUID = (uuid) => {
	return createGlobalState({
		queryKey: vislonQK.vislonTMTEntryByUUID(uuid),
		url: `/zipper/finishing-batch-transaction/${uuid}`,
	});
};

// * Production Log
export const useVislonTMPLog = () =>
	createGlobalState({
		queryKey: vislonQK.vislonTMPLog(),
		url: '/zipper/finishing-batch-production/by/teeth_molding?item_name=vislon',
	});

// * Transaction Log
export const useVislonTMTLog = () =>
	createGlobalState({
		queryKey: vislonQK.vislonTMTLog(),
		url: '/zipper/finishing-batch-transaction/by/teeth_molding_prod?item_name=vislon',
	});

//* Tape Log
export const useVislonTMTapeLog = () =>
	createGlobalState({
		queryKey: vislonQK.vislonTMTapeLog(),
		url: '/zipper/dyed-tape-transaction/by/vislon',
	});
export const useVislonTMTapeLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.vislonTMTapeLogByUUID(uuid),
		url: `/zipper/dyed-tape-transaction/by/vislon_teeth_molding/${uuid}`,
	});

// ! Finishing
// * RM
export const useVislonFinishingRM = () =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRM(),
		url: '/material/stock/by/multi-field/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper',
	});
export const useVislonFinishingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRMByUUID(uuid),
		url: `/material/stock/by/multi-field/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper/${uuid}`,
	});
//* RM Log
export const useVislonFinishingRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRMLog(),
		url: '/material/used/multi-section/by/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper',
	});
export const useVislonFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRMLogByUUID(uuid),
		url: `/material/used/multi-section/by/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper/${uuid}`,
	});
//* order against RM Log
export const useOrderAgainstVislonFinishingRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonFinishingRMLog(),
		url: '/zipper/material-trx-against-order/multiple/by/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper',
	});
export const useOrderAgainstVislonFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonFinishingRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/multiple/by/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper${uuid}`,
	});

// * Finishing Production & Transaction combined data
export const useVislonFinishingProd = () =>
	createGlobalState({
		queryKey: vislonQK.vislonFinishingProd(),
		url: '/zipper/finishing-batch-entry/by/finishing_prod?item_name=vislon',
	});

// * Finishing production log
export const useVislonFinishingProdLog = () =>
	createGlobalState({
		queryKey: vislonQK.vislonFinishingProdLog(),
		url: '/zipper/finishing-batch-production/by/finishing?item_name=vislon',
	});

// * Finishing transaction log
export const useVislonFinishingTrxLog = () =>
	createGlobalState({
		queryKey: vislonQK.vislonFinishingTrxLog(),
		url: '/zipper/finishing-batch-transaction/by/finishing_prod?item_name=vislon',
	});
