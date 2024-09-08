import createGlobalState from '.';
import { materialQK, purchaseQK } from './QueryKeys';

// * Material Section * //
export const useMaterialSection = () =>
	createGlobalState({
		queryKey: materialQK.section(),
		url: '/material/section',
	});

export const useMaterialSectionByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.sectionByUUID(uuid),
		url: `/material/section/${uuid}`,
		enabled: !!uuid,
	});

// * Material Types * //
export const useMaterialType = () =>
	createGlobalState({
		queryKey: materialQK.type(),
		url: '/material/type',
	});

export const useMaterialTypeByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.typeByUUID(uuid),
		url: `/material/type/${uuid}`,
		enabled: !!uuid,
	});

// * Material Info * //
export const useMaterialInfo = () =>
	createGlobalState({
		queryKey: materialQK.info(),
		url: '/material/info',
	});

export const useMaterialInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.infoByUUID(uuid),
		url: `/material/info/${uuid}`,
		enabled: !!uuid,
	});

// * Material Trx * //
export const useMaterialTrx = () =>
	createGlobalState({
		queryKey: materialQK.trx(),
		url: '/material/trx',
	});

export const useMaterialTrxByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.trxByUUID(uuid),
		url: `/material/trx/${uuid}`,
		enabled: !!uuid,
	});

// * Material Stock to sfg * //
export const useMaterialStockToSFG = () =>
	createGlobalState({
		queryKey: materialQK.stockToSGF(),
		url: '/material/stock-to-sfg',
	});

export const useMaterialStockToSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.stockToSFGByUUID(uuid),
		url: `/material/stock-to-sfg/${uuid}`,
		enabled: !!uuid,
	});

// * Purchase Vendor * //
export const usePurchaseVendor = () =>
	createGlobalState({
		queryKey: purchaseQK.vendor(),
		url: '/purchase/vendor',
	});

export const usePurchaseVendorByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.vendorByUUID(uuid),
		url: `/purchase/vendor/${uuid}`,
		enabled: !!uuid,
	});

// * Purchase Description * //
export const usePurchaseDescription = () =>
	createGlobalState({
		queryKey: purchaseQK.description(),
		url: '/purchase/description',
	});

export const usePurchaseDescriptionByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.descriptionByUUID(uuid),
		url: `/purchase/description/${uuid}`,
		enabled: !!uuid,
	});

// * Purchase Entry * //
export const usePurchaseEntry = () =>
	createGlobalState({
		queryKey: purchaseQK.entry(),
		url: '/purchase/entry',
	});

export const usePurchaseEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.entryByUUID(uuid),
		url: `/purchase/entry/${uuid}`,
		enabled: !!uuid,
	});

// * Purchase Details * //
export const usePurchaseDetailsByUUID = (uuid) =>
	createGlobalState({
		queryKey: purchaseQK.detailsByUUID(uuid),
		url: `/purchase/purchase-details/by/${uuid}`,
		enabled: !!uuid,
	});

// * Purchase Log * //
export const usePurchaseLog = () =>
	createGlobalState({
		queryKey: purchaseQK.log(),
		url: `/purchase/purchase-log`,
	});

// * Material_trx_against_order_description *//
export const useMaterialTrxAgainstOrderDescription = () =>
	createGlobalState({
		queryKey: materialQK.trxAgainstOrderDescription(),
		url: '/zipper/material-trx-against-order',
	});

export const useMaterialTrxAgainstOrderDescriptionByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.trxAgainstOrderDescriptionByUUID(uuid),
		url: `/zipper/material-trx-against-order/${uuid}`,
		enabled: !!uuid,
	});
