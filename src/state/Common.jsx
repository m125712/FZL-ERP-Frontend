import createGlobalState from '.';
import { commonQK } from './QueryKeys';

// * TAPE * //
// * SFG * //
export const useCommonTapeSFG = () =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(),
		url: `/zipper/tape-coil`,
	});
export const useCommonTapeSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(uuid),
		url: `/zipper/tape-coil${uuid}`,
	});

// * PRODUCTION * //
export const useCommonTapeProduction = () =>
	createGlobalState({
		queryKey: commonQK.tapeProduction(),
		url: `/zipper/tape-coil-production/by/tape`,
	});
export const useCommonTapeProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeProductionByUUID(uuid),
		url: `/zipper/tape-coil-production/${uuid}`,
	});

// * TAPE TO COIL * //
export const useCommonTapeToCoil = () =>
	createGlobalState({
		queryKey: commonQK.tapeToCoil(),
		url: `/zipper/tape-trx/by/tape`,
	});

export const useCommonTapeToCoilByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeToCoilByUUID(uuid),
		url: `/zipper/tape-trx/${uuid}`,
	});
// * Tape Transfer From Stock
export const useCommonTapeTransfer = () =>
	createGlobalState({
		queryKey: commonQK.tapeTransfer(),
		url: `/zipper/dyed-tape-transaction-from-stock`,
	});

export const useCommonTapeTransferByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeTransferByUUID(uuid),
		url: `/zipper/dyed-tape-transaction-from-stock/${uuid}`,
	});

// * RM * //
export const useCommonTapeRM = () =>
	createGlobalState({
		queryKey: commonQK.tapeRM(),
		url: `/material/stock/by/single-field/tape_making`,
	});
export const useCommonTapeRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeRM(uuid),
		url: `/material/stock/by/single-field/tape_making/${uuid}`,
	});

// * RM * //
export const useCommonTapeRequired = () =>
	createGlobalState({
		queryKey: commonQK.tapeRequired(),
		url: `/zipper/tape-coil-required`,
	});
export const useCommonTapeRequiredByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeRequired(uuid),
		url: `/zipper/tape-coil-required/${uuid}`,
	});

//* RM LOG *//
export const useCommonTapeRMLog = () =>
	createGlobalState({
		queryKey: commonQK.tapeRMLog(),
		url: `/material/used/by/tape_making`,
	});
export const useCommonTapeRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeRMLog(uuid),
		url: `/material/used/by/tape_making${uuid}`,
	});
// * Order Against RM Log * //

export const useCommonOrderAgainstTapeRMLog = () =>
	createGlobalState({
		queryKey: commonQK.orderAgainstTapeRMLog(),
		url: `/zipper/material-trx-against-order/by/tape_making`,
	});
export const useCommonOrderAgainstTapeRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.orderAgainstTapeRMLog(uuid),
		url: `/zipper/material-trx-against-order/by/tape_making${uuid}`,
	});

// * COIL * //
// * SFG * //
export const useCommonCoilSFG = () =>
	createGlobalState({
		queryKey: commonQK.coilSFG(),
		url: `/zipper/tape-coil/by/nylon`,
	});

export const useCommonCoilSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilSFG(uuid),
		url: `/zipper/tape-coil/by/nylon${uuid}`,
	});

// * Coil to Dyeing
export const useCommonCoilToDyeing = () =>
	createGlobalState({
		queryKey: commonQK.coilToDyeing(),
		url: `/zipper/tape-coil-to-dyeing/by/type/nylon`,
	});
export const useCommonCoilToDyeingByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilToDyeingByUUID(uuid),
		url: `/zipper/tape-coil-to-dyeing/${uuid}`,
	});
// * Coil To Stock Log * //
export const useCommonCoilToStockLog = () =>
	createGlobalState({
		queryKey: commonQK.coilToStock(),
		url: `/zipper/tape-trx/by/coil`,
	});
// * Tape Transfer From Stock
export const useCommonCoilTransfer = () =>
	createGlobalState({
		queryKey: commonQK.coilTransfer(),
		url: `/zipper/dyed-tape-transaction-from-stock?item=nylon`,
	});

export const useCommonCoilTransferByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilTransferByUUID(uuid),
		url: `/zipper/dyed-tape-transaction-from-stock/${uuid}`,
	});

// * Tape to Dyeing
export const useCommonTapeToDyeing = () =>
	createGlobalState({
		queryKey: commonQK.tapeToDyeing(),
		url: `/zipper/tape-coil-to-dyeing/by/type/tape`,
	});

// * PRODUCTION * //
export const useCommonCoilProduction = () =>
	createGlobalState({
		queryKey: commonQK.coilProduction(),
		url: `/zipper/tape-coil-production/by/coil`,
	});
export const useCommonCoilProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilProduction(uuid),
		url: `/zipper/tape-coil-production/by/coil/${uuid}`,
	});
//* RM *//
export const useCommonCoilRM = () =>
	createGlobalState({
		queryKey: commonQK.coilRM(),
		url: `/material/stock/by/single-field/coil_forming`,
	});
export const useCommonCoilRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilRM(uuid),
		url: `/material/stock/by/single-field/coil_forming${uuid}`,
	});
//* RM LOG *//
export const useCommonCoilRMLog = () =>
	createGlobalState({
		queryKey: commonQK.coilRMLog(),
		url: `/material/used/by/coil_forming`,
	});
export const useCommonCoilRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilRMLog(uuid),
		url: `/material/used/by/coil_forming${uuid}`,
	});
//* MATERIAL USED *//
export const useCommonMaterialUsed = () =>
	createGlobalState({
		queryKey: commonQK.materialUsed(),
		url: `/material/used`,
	});
export const useCommonMaterialUsedByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.materialUsedByUUID(uuid),
		url: `/material/used/${uuid}`,
	});
// * Order Against RM Log * //

export const useCommonOrderAgainstCoilRMLog = () =>
	createGlobalState({
		queryKey: commonQK.orderAgainstCoilRMLog(),
		url: `/zipper/material-trx-against-order/by/coil_forming`,
	});
export const useCommonOrderAgainstCoilRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.orderAgainstCoilRMLog(uuid),
		url: `/zipper/material-trx-against-order/by/coil_forming${uuid}`,
	});

// * MATERIAL TRX *//

export const useCommonMaterialTrx = () =>
	createGlobalState({
		queryKey: commonQK.materialTrx(),
		url: `/zipper/material-trx-against-order`,
	});
export const useCommonMaterialTrxByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.materialTrxByUUID(uuid),
		url: `/zipper/material-trx-against-order/${uuid}`,
	});

// * MULTI COLOR *//
// * Dashboard
export const useCommonMultiColorDashboard = () =>
	createGlobalState({
		queryKey: commonQK.multiColorDashboard(),
		url: `/zipper/multi-color-dashboard`,
	});

export const useCommonMultiColorDashboardByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.multiColorDashboardByUUID(uuid),
		url: `/zipper/multi-color-dashboard/${uuid}`,
	});

// * log
export const useCommonMultiColorLog = () =>
	createGlobalState({
		queryKey: commonQK.multiColorLog(),
		url: `/zipper/tape-coil-to-dyeing?multi_color_tape=true`,
	});

export const useCommonMultiColorLogTapeReceived = () =>
	createGlobalState({
		queryKey: commonQK.multiColorLogTapeReceived(),
		url: `/zipper/multi-color-tape-receive`,
	});

export const useCommonMultiColorLogTapeReceivedByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.multiColorLogTapeReceivedByUUID(uuid),
		url: `/zipper/multi-color-tape-receive/${uuid}`,
	});
//* Tape Assign *//
export const useCommonTapeAssign = (query) =>
	createGlobalState({
		queryKey: commonQK.tapeAssign(query),
		url: query ? `/zipper/tape-assigned?${query}` : `/zipper/tape-assigned`,
	});

export const useCommonTapeAssignByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeAssignByUUID(uuid),
		url: `/zipper/tape-assigned/${uuid}`,
	});
