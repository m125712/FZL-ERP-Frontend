import createGlobalState from '.';
import { threadQK } from './QueryKeys';

//Count-length
export const useThreadCountLength = () =>
	createGlobalState({
		queryKey: threadQK.countLength(),
		url: '/thread/count-length',
	});

export const useThreadCountLengthByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.countLengthByUUID(uuid),
		url: `/thread/count-length/${uuid}`,
	});
//Machine
export const useThreadMachine = () =>
	createGlobalState({
		queryKey: threadQK.machine(),
		url: '/public/machine',
	});

export const useThreadMachineByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.machineByUUID(uuid),
		url: `/public/machine/${uuid}`,
	});

//Order-info
export const useThreadOrderInfo = () =>
	createGlobalState({
		queryKey: threadQK.orderInfo(),
		url: '/thread/order-info',
	});
export const useThreadOrderInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.orderInfoByUUID(uuid),
		url: `/thread/order-info/${uuid}`,
	});
//Order-info-entry
export const useThreadOrderInfoEntry = () =>
	createGlobalState({
		queryKey: threadQK.orderInfoEntry(),
		url: '/thread/order-entry',
	});
export const useThreadOrderInfoEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.orderInfoEntryByUUID(uuid),
		url: `/thread/order-entry/${uuid}`,
	});
//Swatch
export const useThreadSwatch = () =>
	createGlobalState({
		queryKey: threadQK.swatch(),
		url: '/thread/order-swatch',
	});
export const useThreadSwatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.swatchByUUID(uuid),
		url: `/thread/order-swatch/${uuid}`,
	});
//*DyesCategory
export const useThreadDyesCategory = () =>
	createGlobalState({
		queryKey: threadQK.dyesCategory(),
		url: '/thread/dyes-category',
	});
export const useThreadDyesCategoryByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.dyesCategoryByUUID(uuid),
		url: `/thread/dyes-category/${uuid}`,
	});
//*Programs
export const useThreadPrograms = () =>
	createGlobalState({
		queryKey: threadQK.programs(),
		url: '/thread/programs',
	});
export const useThreadProgramsByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.programsByUUID(uuid),
		url: `/thread/programs/${uuid}`,
	});

// * Coning
export const useDyeingCone = () =>
	createGlobalState({
		queryKey: threadQK.coning(),
		url: '/thread/batch-entry-details',
	});

//* coning production
export const useConeProdByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.ConningProdByUUID(uuid),
		url: `/thread/batch-entry-production/${uuid}`,
	});

//* coning trx
export const useConeTrxByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.ConningTrxByUUID(uuid),
		url: `/thread/batch-entry-trx/${uuid}`,
	});

//* log
export const useConningProdLog = () =>
	createGlobalState({
		queryKey: threadQK.ConningProdlog(),
		url: '/thread/batch-entry-production-details',
	});

export const useConningTrxLog = () =>
	createGlobalState({
		queryKey: threadQK.ConningTrxlog(),
		url: '/thread/batch-entry-trx-details',
	});

//* Challan
export const useThreadChallan = () =>
	createGlobalState({
		queryKey: threadQK.challan(),
		url: '/thread/challan',
	});

export const useThreadOrderDetailsForChallanByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.challanByUUID(uuid),
		url: `/thread/order-details-for-challan/by/${uuid}`,
	});

export const useThreadChallanDetailsByUUID = (uuid) =>
	createGlobalState({
		queryKey: threadQK.challanDetailsByUUID(uuid),
		url: `/thread/challan-details/by/${uuid}`,
	});
