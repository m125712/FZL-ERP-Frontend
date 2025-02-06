import createGlobalState from '.';
import { orderQK } from './QueryKeys';

// * Details * //
export const useOrderDetails = () =>
	createGlobalState({
		queryKey: orderQK.details(),
		url: '/zipper/order/details',
	});

export const useOrderDetailsByQuery = (query, { enabled = false }) =>
	createGlobalState({
		queryKey: orderQK.detailsByQuery(query),
		url: `/zipper/order/details${query}`,
		enabled: enabled,
	});

export const useOrderDetailsByStyleForPDF = (uuid, param) =>
	createGlobalState({
		queryKey: orderQK.detailByStyleForPDF(uuid, param),
		url: param
			? `/zipper/order-all-info/by/${uuid}?order_description_uuid=${param}`
			: `/zipper/order-all-info/by/${uuid}`,
	});

export const useOrderDetailsByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.detail(uuid),
		url: `/zipper/order-detail/${uuid}`,
	});

export const useOrderDetailsByOrderNumber = (orderNumber) =>
	createGlobalState({
		queryKey: orderQK.detailByOrderNumber(orderNumber),
		url: `/zipper/order/details/single-order/by/${orderNumber}`,
	});

// * Description * //
export const useOrderDescription = () =>
	createGlobalState({
		queryKey: orderQK.descriptions(),
		url: '/zipper/order-description',
	});

export const useOrderDescriptionByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.descriptions(uuid),
		url: `/zipper/order-description/${uuid}`,
	});

export const useOrderDescriptionWithEntry = (uuid) =>
	createGlobalState({
		queryKey: orderQK.orderDescriptionWithEntry(uuid),
		url: `/zipper/order/details/single-order/by/${uuid}/UUID`,
	});

// * Entry * //
export const useOrderEntries = () =>
	createGlobalState({
		queryKey: orderQK.entries(),
		url: '/zipper/order-entry',
	});

export const useOrderEntriesByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.entry(uuid),
		url: `/zipper/order-entry/${uuid}`,
	});

// * Buyer * //
export const useOrderBuyer = () =>
	createGlobalState({
		queryKey: orderQK.buyers(),
		url: '/public/buyer',
	});

export const useOrderBuyerByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.buyer(uuid),
		url: `/public/buyer/${uuid}`,
	});

//*Party */
export const useOrderParty = () =>
	createGlobalState({
		queryKey: orderQK.party(),
		url: '/public/party',
	});
export const useOrderPartyByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.party(uuid),
		url: `/public/party/${uuid}`,
	});

// * Marketing * //
export const useOrderMarketing = () =>
	createGlobalState({
		queryKey: orderQK.marketings(),
		url: '/public/marketing',
	});

export const useOrderMarketingByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.marketing(uuid),
		url: `/public/marketing/${uuid}`,
	});

// * Factory * //
export const useOrderFactory = () =>
	createGlobalState({
		queryKey: orderQK.factories(),
		url: '/public/factory',
	});

export const useOrderFactoryByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.factory(uuid),
		url: `/public/factory/${uuid}`,
	});

// * Merchandiser * //
export const useOrderMerchandiser = () =>
	createGlobalState({
		queryKey: orderQK.merchandisers(),
		url: '/public/merchandiser',
	});

export const useOrderMerchandiserByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.merchandiser(uuid),
		url: `/public/merchandiser/${uuid}`,
	});

// * Properties * //
export const useOrderProperties = () =>
	createGlobalState({
		queryKey: orderQK.properties(),
		url: '/public/properties',
	});
export const useOrderPropertiesByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.propertiesByUUID(uuid),
		url: `/public/properties/${uuid}`,
	});

// * Info * //
export const useOrderInfo = () =>
	createGlobalState({
		queryKey: orderQK.info(),
		url: '/zipper/order-info',
	});

export const useOrderInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.infoByUUID(uuid),
		url: `/zipper/order-info/${uuid}`,
	});
