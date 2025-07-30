import createGlobalState from '.';
import { sliderQK } from './QueryKeys';

// * Slider Assembly

// * RM
export const useSliderAssemblyRM = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRM(),
		url: '/material/stock/by/single-field/slider_assembly',
	});

export const useSliderAssemblyRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRMByUUID(uuid),
		url: `/material/stock/by/single-field/slider_assembly${uuid}`,
	});
// * RM Log
export const useSliderAssemblyRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRMLog(),
		url: '/material/used/by/slider_assembly',
	});
export const useSliderAssemblyRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRMLogByUUID(uuid),
		url: `/material/used/by/slider_assembly${uuid}`,
	});

// * Slider/Dashboard --> (Info)
export const useSliderDashboardInfo = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDashboardInfo(),
		url: '/slider/stock',
	});

export const useSliderDashboardInfoByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: sliderQK.sliderDashboardInfoByUUID(uuid),
		url: `/slider/stock/${uuid}`,
		enabled,
	});

// * Die Casting --> (STOCK)
export const useSliderDieCastingStock = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingStock(),
		url: '/slider/die-casting',
	});

// * Die Casting --> (STOCK BY ORDER NUMBERS)
export const useSliderDieCastingStockByOrderNumbers = (
	orderNumbers = [],
	{ enabled = true }
) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingStockByOrderNumbers(...orderNumbers),
		url: `/slider/die-casting/for/slider-stock-multi/${orderNumbers.join(',')}`,
		enabled,
	});

// * Die Casting --> (PRODUCTION)
export const useSliderDieCastingProduction = (query) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingProduction(query),
		url: query
			? `/slider/die-casting-production?${query}`
			: '/slider/die-casting-production',
	});

export const useSliderDieCastingProductionByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingProductionByUUID(uuid),
		url: `/slider/die-casting-production/${uuid}`,
		enabled,
	});

// * Die Casting --> (TRANSFER)
export const useSliderDieCastingTransfer = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingTransfer(),
		url: '/slider/die-casting-transfer',
	});

// * Die Casting --> (TRANSFER STOCK + ORDER)
export const useSliderDiecastingTrxLog = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDiecastingTrxLog(),
		url: '/slider/die-casting-trx-log',
	});

// * Die Casting --> (TRANSFER -> Against Stock)
export const useSliderDieCastingTransferAgainstStock = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingByStock(),
		url: '/slider/trx-against-stock',
	});

export const useSliderDieCastingTransferAgainstStockByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingByStockByUUID(uuid),
		url: `/slider/trx-against-stock/${uuid}`,
	});

// * Die Casting --> (TRANSFER -> Against Order)
export const useSliderDieCastingTransferAgainstOrder = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingByOrder(),
		url: '/slider/die-casting-transaction',
	});

export const useSliderDieCastingTransferAgainstOrderByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingByOrderByUUID(uuid),
		url: `/slider/die-casting-transaction/${uuid}`,
	});

// * Order Against RM Log
export const useOrderAgainstSliderAssemblyRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderAssemblyRMLog(),
		url: '/zipper/material-trx-against-order/by/slider_assembly',
	});
export const useOrderAgainstSliderAssemblyRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderAssemblyRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/slider_assembly${uuid}`,
	});
// * Die Casting
// * RM
export const useSliderDieCastingRM = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRM(),
		url: '/material/stock/by/single-field/die_casting',
	});
export const useSliderDieCastingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRMByUUID(uuid),
		url: `/material/stock/by/single-field/die_casting${uuid}`,
	});
// * RM Log
export const useSliderDieCastingRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRMLog(),
		url: '/material/used/by/die_casting',
	});
export const useSliderDieCastingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRMLogByUUID(uuid),
		url: `/material/used/by/die_casting${uuid}`,
	});
// * Order Against RM Log
export const useOrderAgainstDieCastingRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstDieCastingRMLog(),
		url: '/zipper/material-trx-against-order/by/die_casting',
	});
export const useOrderAgainstDieCastingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstDieCastingRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/die_casting${uuid}`,
	});
// * Coloring

// * RM
export const useSliderColoringRM = () =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRM(),
		url: '/material/stock/by/single-field/coloring',
	});
export const useSliderColoringRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRMByUUID(uuid),
		url: `/material/stock/by/single-field/coloring${uuid}`,
	});
// * RM Log
export const useSliderColoringRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRMLog(),
		url: '/material/used/by/coloring',
	});
export const useSliderColoringRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRMLogByUUID(uuid),
		url: `/material/used/by/coloring${uuid}`,
	});
// * Order Against RM Log
export const useOrderAgainstSliderColorRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderColorRMLog(),
		url: '/zipper/material-trx-against-order/by/coloring',
	});
export const useOrderAgainstSliderColorRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderColorRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/coloring${uuid}`,
	});

// * Slider Assembly
// * Slider Assembly Stock
export const useSliderAssemblyStock = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyStock(),
		url: '/slider/assembly-stock',
	});

export const useSliderAssemblyStockByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyStockByUUID(uuid),
		url: `/slider/assembly-stock/${uuid}`,
	});

// * Slider Assembly Production (Stock)
export const useSliderAssemblyProduction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyProduction(),
		url: '/slider/stock/by/sa_prod',
	});

// * Slider Assembly Production entry

export const useSliderAssemblyProductionEntry = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyProductionEntry(),
		url: `/slider/production`,
	});

export const useSliderAssemblyProductionEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyProductionEntryByUUID(uuid),
		url: `/slider/production/${uuid}`,
	});

// * Slider Assembly Transfer Entry
export const useSliderAssemblyTransferEntry = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyTransferEntry(),
		url: `/slider/transaction`,
	});

export const useSliderAssemblyTransferEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyTransferEntryByUUID(uuid),
		url: `/slider/transaction/${uuid}`,
	});

// * Slider Assembly Log Joined Prduction
export const useSliderAssemblyLogJoinedProduction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyLogjoinedProduction(),
		url: '/slider/assembly-production-log',
	});

export const useSliderAssemblyStoreIssued = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyStoreIssued(),
		url: '/zipper/material-trx-against-order?trx_to=slider_assembly&purpose=slider ',
	});

// * Slider Assembly Log Prduction
export const useSliderAssemblyLogProduction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyLogProduction(),
		url: '/slider/production/by/sa_prod',
	});

// * slider assembly stock production
export const useSliderAssemblyStockProduction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyStockProduction(),
		url: '/slider/die-casting-to-assembly-stock',
	});

export const useSliderAssemblyStockProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyStockProductionByUUID(uuid),
		url: `/slider/die-casting-to-assembly-stock/${uuid}`,
	});

// * slider assembly Log Transaction
export const useSliderAssemblyLogTransaction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyLogTransaction(),
		url: `/slider/transaction/by/sa_prod`,
	});

// * slider assembly stock Transaction
export const useSliderAssemblyStockTransaction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyStockTransaction(),
		url: '/slider/transaction/by/assembly_stock',
	});

export const useSliderAssemblyStockTransactionByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyStockTransactionByUUID(uuid),
		url: `/slider/transaction/${uuid}`,
	});

// * Slider Coloring log //
// * Slider Coloring Log Prduction
export const useSliderColoringLogProduction = (from, to) =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringLogProduction(from, to),
		url:
			from && to
				? `/slider/production/by/coloring?from=${from}&to=${to}`
				: '/slider/production/by/coloring',
	});

// * slider coloring Log Transaction
export const useSliderColoringLogTransaction = (from, to) =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringLogTransaction(from, to),
		url:
			from && to
				? `/slider/transaction/by/coloring_prod?from_date=${from}&to_date=${to}`
				: `/slider/transaction/by/coloring_prod`,
	});

// * Slider coloring Production (Stock)
export const useSliderColoringProduction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringProduction(),
		url: '/slider/stock/by/coloring_prod',
	});
