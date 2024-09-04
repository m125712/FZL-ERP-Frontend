import createGlobalState from '.';
import { commercialQK } from './QueryKeys';

// * Bank * //
export const useCommercialBank = () =>
	createGlobalState({
		queryKey: commercialQK.bank(),
		url: '/commercial/bank',
	});

export const useCommercialBankByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.bankByUUID(uuid),
		url: `/commercial/bank/${uuid}`,
		enabled: !!uuid,
	});

// * PI * //
export const useCommercialPI = () =>
	createGlobalState({
		queryKey: commercialQK.pi(),
		url: '/commercial/pi',
	});

export const useCommercialPIByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.piByUUID(uuid),
		url: `/commercial/pi/${uuid}`,
		enabled: !!uuid,
	});

export const useCommercialPIDetailsByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: commercialQK.piDetailsByUUID(uuid),
		url: `/commercial/pi/details/${uuid}`,
		enabled,
	});

export const useCommercialPIDetailsByPiId = (pi_id) =>
	createGlobalState({
		queryKey: commercialQK.piDetailsByPiID(pi_id),
		url: `/commercial/pi/details/by/pi-id/${pi_id}`,
		enabled: !!pi_id,
	});

// * PI Entry * //
export const useCommercialPIEntry = () =>
	createGlobalState({
		queryKey: commercialQK.piEntry(),
		url: '/commercial/pi-entry',
	});

export const useCommercialPIEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.piEntryByUUID(uuid),
		url: `/commercial/pi-entry/${uuid}`,
		enabled: !!uuid,
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
		queryKey: commercialQK.lc(),
		url: '/commercial/lc',
	});

export const useCommercialLCByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.lcByUUID(uuid),
		url: `/commercial/lc/${uuid}`,
		enabled: !!uuid,
	});

export const useCommercialLCPIByUUID = (uuid) =>
	createGlobalState({
		queryKey: commercialQK.lcByPi(uuid),
		url: `/commercial/lc-pi/by/${uuid}`,
		enabled: !!uuid,
	});

export const useCommercialLCByNumber = (number) =>
	createGlobalState({
		queryKey: commercialQK.lcByNumber(number),
		url: `/commercial/lc/by/lc-number/${number}`,
		enabled: !!number,
	});
