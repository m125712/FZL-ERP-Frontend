import createGlobalState from '.';
import { storeQK } from './QueryKeys';

// * Section * //
export const useStoreSection = () =>
	createGlobalState({
		queryKey: storeQK.sections(),
		url: '/material/section',
	});

export const useStoreSectionByUUID = (uuid) =>
	createGlobalState({
		queryKey: storeQK.section(uuid),
		url: `/material/section/${uuid}`,
	});

// * Types * //
export const useStoreType = () =>
	createGlobalState({
		queryKey: storeQK.types(),
		url: '/material/type',
	});

export const useStoreTypeByUUID = (uuid) =>
	createGlobalState({
		queryKey: storeQK.type(uuid),
		url: `/material/type/${uuid}`,
	});

// * Info * //
export const useStoreInfo = () =>
	createGlobalState({
		queryKey: storeQK.infos(),
		url: '/material/info',
	});

export const useStoreInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: storeQK.info(uuid),
		url: `/material/info/${uuid}`,
	});

// * Trx * //
export const useStoreTrx = () =>
	createGlobalState({
		queryKey: storeQK.trxs(),
		url: '/material/trx',
	});

export const useStoreTrxByUUID = (uuid) =>
	createGlobalState({
		queryKey: storeQK.trx(uuid),
		url: `/material/trx/${uuid}`,
	});

// * Stock to sfg * //
export const useStoreStockToSFG = () =>
	createGlobalState({
		queryKey: storeQK.stockToSGFs(),
		url: '/material/stock-to-sfg',
	});

export const useStoreStockToSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: storeQK.stockToSFG(uuid),
		url: `/material/stock-to-sfg/${uuid}`,
	});
