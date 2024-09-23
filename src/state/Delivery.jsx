import createGlobalState from '.';
import { deliveryQk } from './QueryKeys';

// * Packing List
export const useDeliveryPackingList = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryPackingList(),
		url: '/delivery/packing-list',
	});

export const useDeliveryPackingListByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryPackingListByUUID(uuid),
		url: `/delivery/packing-list/${uuid}`,
		enabled: !!uuid,
	});

export const useDeliveryPackingListDetailsByUUID = (uuid, { params }) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryPackingListDetailsByUUID(uuid),
		url: `/delivery/packing-list/details/${uuid}?${params}`,
		enabled: !!uuid,
	});

// /delivery/order-for-packing-list/{order_info_uuid}

export const useDeliveryPackingListByOrderInfoUUID = (order_info_uuid) =>
	createGlobalState({
		queryKey:
			deliveryQk.deliveryPackingListByOrderInfoUUID(order_info_uuid),
		url: `/delivery/order-for-packing-list/${order_info_uuid}`,
		enabled: !!order_info_uuid,
	});

export const useDeliveryPackingListEntry = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryPackingListEntry(),
		url: `/delivery/packing-list-entry`,
	});
export const useDeliveryPackingListEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryPackingListEntryByUUID(uuid),
		url: `/delivery/packing-list-entry/${uuid}`,
		enabled: !!uuid,
	});

// * RM
export const useDeliveryRM = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryRM(),
		url: '/material/stock/by/multi-field/m_qc_and_packing,n_qc_and_packing,v_qc_and_packing,s_qc_and_packing',
	});

export const useDeliveryRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryRMByUUID(uuid),
		url: '/material/stock/by/multi-field/m_qc_and_packing,n_qc_and_packing,v_qc_and_packing,s_qc_and_packing',
	});

// * RM Log
export const useDeliveryRMLog = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryRMLog(),
		url: '/material/used/multi-section/by/m_qc_and_packing,n_qc_and_packing,v_qc_and_packing,s_qc_and_packing',
	});
export const useDeliveryRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryRMLogByUUID(uuid),
		url: '/material/used/multi-section/by/m_qc_and_packing,n_qc_and_packing,v_qc_and_packing,s_qc_and_packing',
	});
// *  Order Against Delivery RM Log * //
export const useOrderAgainstDeliveryRMLog = () =>
	createGlobalState({
		queryKey: deliveryQk.orderAgainstDeliveryRMLog(),
		url: '/zipper/material-trx-against-order/multiple/by/m_qc_and_packing,n_qc_and_packing,v_qc_and_packing,s_qc_and_packing',
	});
export const useOrderAgainstDeliveryRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.orderAgainstDeliveryRMLogByUUID(uuid),
		url: '/zipper/material-trx-against-order/multiple/by/m_qc_and_packing,n_qc_and_packing,v_qc_and_packing,s_qc_and_packing',
	});
