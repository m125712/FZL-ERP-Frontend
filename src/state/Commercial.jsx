import createGlobalState from '.';
import { commercialQK } from './QueryKeys';

// * Bank * //
export const useCommercialBank = () =>
	createGlobalState({
		queryKey: commercialQK.banks(),
		url: '/commercial/bank',
	});

export const useCommercialBankByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: commercialQK.bankByUUID(uuid),
		url: `/commercial/bank/${uuid}`,
		enabled,
	});

// * PI * //
export const useCommercialPI = () =>
	createGlobalState({
		queryKey: commercialQK.pis(),
		url: '/commercial/pi',
	});

export const useCommercialPIByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.pi(uuid),
		url: `/commercial/pi/${uuid}`,
	});

export const useCommercialPIDetailsByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: commercialQK.piDetailsByUUID(uuid),
		url: `/commercial/pi/details/${uuid}`,
		enabled,
	});

export const useCommercialPIDetailsByPiId = (pi_id, { enabled = true }) =>
	createGlobalState({
		queryKey: commercialQK.piDetailsByPiID(pi_id),
		url: `/commercial/pi/details/by/pi-id/${pi_id}`,
		enabled,
	});

// * PI Entry * //
export const useCommercialPIEntry = () =>
	createGlobalState({
		queryKey: commercialQK.piEntries(),
		url: '/commercial/pi-entry',
	});

export const useCommercialPIEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.piEntry(uuid),
		url: `/commercial/pi-entry/${uuid}`,
	});

// * PI by orderInfoIds * //
export const useCommercialPIByOrderInfo = (
	orderInfoIds,
	partyId,
	marketingId,
	{ enabled = true }
) =>
	createGlobalState({
		queryKey: commercialQK.piByOrderInfo(
			orderInfoIds,
			partyId,
			marketingId
		),
		url: `/commercial/pi/details/by/order-info-ids/${orderInfoIds}/${partyId}/${marketingId}`,
		enabled,
	});

// * LC * //
export const useCommercialLC = () =>
	createGlobalState({
		queryKey: commercialQK.lcs(),
		url: '/commercial/lc',
	});

export const useCommercialLCByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.lc(uuid),
		url: `/commercial/lc/${uuid}`,
	});

export const useCommercialLCPIByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.lcPi(uuid),
		url: `/commercial/lc-pi/by/${uuid}`,
	});

export const useCommercialLCByNumber = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.lcNumber(uuid),
		url: `/commercial/lc/by/lc-number/${uuid}`,
	});
