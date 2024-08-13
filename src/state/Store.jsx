import createGlobalState from '.';
import { materialQK, purchaseQK } from './QueryKeys';

// * Material Section * //
export const useMaterialSection = () =>
	createGlobalState({
		queryKey: materialQK.sections(),
		url: '/material/section',
	});

export const useMaterialSectionByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.section(uuid),
		url: `/material/section/${uuid}`,
	});

// * Material Types * //
export const useMaterialType = () =>
	createGlobalState({
		queryKey: materialQK.types(),
		url: '/material/type',
	});

export const useMaterialTypeByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.type(uuid),
		url: `/material/type/${uuid}`,
	});

// * Material Info * //
export const useMaterialInfo = () =>
	createGlobalState({
		queryKey: materialQK.infos(),
		url: '/material/info',
	});

export const useMaterialInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.info(uuid),
		url: `/material/info/${uuid}`,
	});

// * Material Trx * //
export const useMaterialTrx = () =>
	createGlobalState({
		queryKey: materialQK.trxs(),
		url: '/material/trx',
	});

export const useMaterialTrxByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.trx(uuid),
		url: `/material/trx/${uuid}`,
	});

// * Material Stock to sfg * //
export const useMaterialStockToSFG = () =>
	createGlobalState({
		queryKey: materialQK.stockToSGFs(),
		url: '/material/stock-to-sfg',
	});

export const useMaterialStockToSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.stockToSFG(uuid),
		url: `/material/stock-to-sfg/${uuid}`,
	});

// * Purchase Vendor * //
export const usePurchaseVendor = () =>
	createGlobalState({
		queryKey: purchaseQK.vendors(),
		url: '/purchase/vendor',
	});

export const usePurchaseVendorByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.vendor(uuid),
		url: `/purchase/vendor/${uuid}`,
	});

// * Purchase Description * //
export const usePurchaseDescription = () =>
	createGlobalState({
		queryKey: purchaseQK.descriptions(),
		url: '/purchase/description',
	});

export const usePurchaseDescriptionByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.description(uuid),
		url: `/purchase/description/${uuid}`,
	});

// * Purchase Entry * //
export const usePurchaseEntry = () =>
	createGlobalState({
		queryKey: purchaseQK.entries(),
		url: '/purchase/entry',
	});

export const usePurchaseEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.entry(uuid),
		url: `/purchase/entry/${uuid}`,
	});
