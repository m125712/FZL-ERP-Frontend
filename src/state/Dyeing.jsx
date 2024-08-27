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
export const useDyeingRMLog = () =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRMLog(),
		url: `/material/used/by/dying_and_iron`,
	});
export const useDyeingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRMLog(uuid),
		url: `/material/used/by/dying_and_iron${uuid}`,
	});

// * Info
export const useDyeingSwatch = () =>
	createGlobalState({
		queryKey: dyeingQK.swatch(),
		url: '/zipper/sfg-swatch',
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
export const useDyeingBatch = () =>
	createGlobalState({
		queryKey: dyeingQK.batch(),
		url: '/zipper/batch',
	});

export const useDyeingBatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.batchByUUID(uuid),
		url: `/zipper/batch/${uuid}`,
	});

// * Thread Batch
export const useDyeingThreadBatch = () =>
	createGlobalState({
		queryKey: dyeingQK.threadBatch(),
		url: '/thread/batch',
	});

export const useDyeingThreadBatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.threadBatchByUUID(uuid),
		url: `/thread/batch/${uuid}`,
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
