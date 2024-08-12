import createGlobalState from '.';
import { materialQK } from './QueryKeys';

// * Section * //
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

// * Types * //
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

// * Info * //
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

// * Trx * //
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

// * Stock to sfg * //
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
