import createGlobalState from '@/state';

import { dyeingQK } from './QueryKeys';

//* RM
export const useDyeingRM = () =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRM(),
		url: `/material/stock/by/single-field/dying_and_iron`,
	});

export const useDyeingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRM(uuid),
		url: `/material/stock/by/single-field/dying_and_iron/${uuid}`,
	});

//* RM Log
export const useDyeingRMLog = (query) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRMLog(query),
		url: `/material/used/multi-section/by/${query}`,
	});

export const useDyeingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRMLog(uuid),
		url: `/material/used/by/dying_and_iron${uuid}`,
	});

// * Info
export const useDyeingSwatch = (query) =>
	createGlobalState({
		queryKey: dyeingQK.swatch(query),
		url: query ? `/zipper/sfg-swatch?${query}` : '/zipper/sfg-swatch',
	});

export const useDyeingSwatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.swatchByUUID(uuid),
		url: `/zipper/sfg-swatch/${uuid}`,
	});

// * Planning_sno
export const useDyeingPlanning = () =>
	createGlobalState({
		queryKey: dyeingQK.planning(),
		url: '/zipper/planning',
	});

export const useDyeingPlanningByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.planningByUUID(uuid),
		url: `/zipper/planning/${uuid}`,
	});

// * Batch
export const useDyeingBatch = (query) =>
	createGlobalState({
		queryKey: dyeingQK.batch(query),
		url: query ? `/zipper/dyeing-batch?${query}` : '/zipper/dyeing-batch',
	});

export const useDyeingBatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.batchByUUID(uuid),
		url: `/zipper/dyeing-batch/${uuid}`,
	});

//* OrderBatch
export const useDyeingOrderBatch = (params) =>
	createGlobalState({
		queryKey: dyeingQK.orderBatch(params),
		url: params
			? `/zipper/dyeing-order-batch?${params}`
			: '/zipper/dyeing-order-batch',
	});

export const useDyeingOrderBatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.orderBatchByUUID(uuid),
		url: `/zipper/dyeing-order-batch/${uuid}`,
	});
//*Batch Details
export const useDyeingBatchDetails = () =>
	createGlobalState({
		queryKey: dyeingQK.batchDetails(),
		url: '/zipper/dyeing-batch-details',
	});
export const useDyeingBatchDetailsByUUID = (uuid, param = '') =>
	createGlobalState({
		queryKey: dyeingQK.batchDetailsByUUID(uuid, param),
		url: `/zipper/dyeing-batch-details/${uuid}${param}`,
	});
// * Thread Batch
export const useDyeingThreadBatch = (query) =>
	createGlobalState({
		queryKey: dyeingQK.threadBatch(query),
		url: query ? `/thread/batch?${query}` : '/thread/batch',
	});

export const useDyeingThreadBatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.threadBatchByUUID(uuid),
		url: `/thread/batch/${uuid}`,
	});
//* Thread Order Batch
export const useDyeingThreadOrderBatch = (params) =>
	createGlobalState({
		queryKey: dyeingQK.threadOrderBatch(params),
		url: params ? `/thread/order-batch?${params}` : '/thread/order-batch',
	});
export const useDyeingThreadOrderBatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.threadOrderBatchByUUID(uuid),
		url: `/thread/order-batch/${uuid}`,
	});
// * Thread Batch Details
export const useDyeingThreadBatchDetails = () =>
	createGlobalState({
		queryKey: dyeingQK.threadBatchDetails(),
		url: '/thread/batch-details/by/',
	});
export const useDyeingThreadBatchDetailsByUUID = (uuid, param = '') =>
	createGlobalState({
		queryKey: dyeingQK.threadBatchDetailsByUUID(uuid, param),
		url: `/thread/batch-details/by/${uuid}${param}`,
	});
//* Thread Batch Entry
export const useDyeingThreadBatchEntry = () =>
	createGlobalState({
		queryKey: dyeingQK.threadBatchEntry(),
		url: '/thread/batch-entry',
	});

export const useDyeingThreadBatchEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.threadBatchEntryByUUID(uuid),
		url: `/thread/batch-entry${uuid}`,
	});

//* Order Against RM Log
export const useOrderAgainstDyeingRMLog = () =>
	createGlobalState({
		queryKey: dyeingQK.orderAgainstDyeingRMLog(),
		url: `/zipper/material-trx-against-order/by/dying_and_iron`,
	});
export const useOrderAgainstDyeingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.orderAgainstDyeingRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/dying_and_iron${uuid}`,
	});

//Dyeing Transfer
export const useDyeingTransfer = () =>
	createGlobalState({
		queryKey: dyeingQK.dyeingTransfer(),
		url: '/zipper/dyed-tape-transaction',
	});
export const useDyeingTransferByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingTransferByUUID(uuid),
		url: `/zipper/dyed-tape-transaction/${uuid}`,
	});

// * dummy query for updating swatches
export const useDyeingDummy = () =>
	createGlobalState({
		queryKey: dyeingQK.dyeingDummy(),
		url: '/commercial/manual-pi',
	});

//? Finishing Batch
//* Get all Finishing Batch
export const useDyeingFinishingBatch = (query) =>
	createGlobalState({
		queryKey: dyeingQK.finishingBatch(query),
		url: query
			? `/zipper/finishing-batch?${query}`
			: '/zipper/finishing-batch',
	});

//* Get Specific Finishing Batch
export const useDyeingFinishingBatchByUUID = (uuid, params) =>
	createGlobalState({
		queryKey: dyeingQK.finishingBatchByUUID(uuid, params),
		url: params
			? `/zipper/finishing-batch/by/finishing_batch_uuid/${uuid}?${params}`
			: `/zipper/finishing-batch/by/finishing_batch_uuid/${uuid}`,
	});

//* Get orders for finishing batch using order_description_uuid
export const useDyeingFinishingBatchOrders = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.finishingBatchOrders(uuid),
		url: `/zipper/finishing-order-batch/${uuid}`,
	});

// * Dyeing Dashboard
export const useDyeingDashboard = (param) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingDashboard(param),
		url: `/public/machine/by/${param}`,
	});

// * Finishing Dashboard
export const useDyeingFinishingDashboard = (from, to, { enabled = false }) =>
	createGlobalState({
		queryKey: dyeingQK.finishingDashboard(from, to),
		url: `/zipper/finishing-batch-capacity-details?from_date=${from}&to_date=${to}`,
		enabled,
	});

// * Product Capacity
export const useDyeingProductCapacity = () =>
	createGlobalState({
		queryKey: dyeingQK.productCapacity(),
		url: '/public/production-capacity',
	});

export const useDyeingProductCapacityByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.productCapacityByUUID(uuid),
		url: `/public/production-capacity/${uuid}`,
	});
