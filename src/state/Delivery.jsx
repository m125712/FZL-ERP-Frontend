import createGlobalState from '.';
import { challanQK, deliveryQk } from './QueryKeys';

//*Dashboard
//* Zipper
export const useDeliveryZipperDashboard = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryZipperDashboard(),
		url: '/delivery/dashboard',
	});

export const useDeliveryZipperDashboardByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryZipperDashboardByUUID(uuid),
		url: `/delivery/dashboard${uuid}`,
		enabled: !!uuid,
	});
//* Thread
export const useDeliveryThreadDashboard = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryThreadDashboard(),
		url: '/delivery/dashboard-thread',
	});

export const useDeliveryThreadDashboardByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryThreadDashboardByUUID(uuid),
		url: `/delivery/dashboard-thread/${uuid}`,
		enabled: !!uuid,
	});

// * Challan
export const useDeliveryChallan = (query = '', { enabled = false } = {}) =>
	createGlobalState({
		queryKey: challanQK.deliveryChallan(query),
		url: query ? `/delivery/challan?${query}` : `/delivery/challan`,
		enabled: enabled,
	});

export const useDeliveryChallanByUUID = (uuid) =>
	createGlobalState({
		queryKey: challanQK.deliveryChallanByUUID(uuid),
		url: `/delivery/challan/${uuid}`,
		enabled: !!uuid,
	});
export const useDeliveryChallanDetailsByUUID = (uuid) =>
	createGlobalState({
		queryKey: challanQK.deliveryChallanDetailsByUUID(uuid),
		url: `/delivery/challan/details/${uuid}`,
		enabled: !!uuid,
	});

export const useDeliveryChallanEntry = () =>
	createGlobalState({
		queryKey: challanQK.deliveryChallanEntry(),
		url: '/delivery/update-challan-uuid/for-packing-list',
	});

export const useDeliveryChallanEntryByUUID = (uuid) =>
	createGlobalState({
		queryKey: challanQK.deliveryChallanEntryByUUID(uuid),
		url: `/delivery/challan-entry/${uuid}`,
	});

export const useDeliveryChallanEntryByChallanUUID = (challanUUID) =>
	createGlobalState({
		queryKey: challanQK.deliveryChallanEntryByChallanUUID(challanUUID),
		url: `/delivery/packing-list?challan_uuid=${challanUUID}`,
	});

// * Packing List
export const useDeliveryPackingList = (query = '') =>
	createGlobalState({
		queryKey: deliveryQk.deliveryPackingList(query),
		url: `/delivery/packing-list${query}`,
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
export const useDeliveryPackingListEntryByPackingListUUID = (
	packing_list_uuids
) =>
	createGlobalState({
		queryKey:
			deliveryQk.deliveryPackingListEntryByPackingListUUID(
				packing_list_uuids
			),

		url: `/delivery/packing-list-entry/by/multi-packing-list-uuid/${packing_list_uuids?.join(',')}`,
		enabled: !!packing_list_uuids && packing_list_uuids?.length > 0,
	});

export const useDeliveryChallanEntryForPackingListByPackingListUUID = (
	packing_list_uuids
) =>
	createGlobalState({
		queryKey:
			deliveryQk.deliveryChallanEntryForPackingListByPackingListUUID(
				packing_list_uuids
			),
		url: `/delivery/challan-entry-for-packing-list-multi/by/${packing_list_uuids?.join(',')}`,
		enabled: !!packing_list_uuids && packing_list_uuids?.length > 0,
	});

// /delivery/order-for-packing-list/{order_info_uuid}

export const useDeliveryPackingListByOrderInfoUUID = (order_info_uuid, param) =>
	createGlobalState({
		queryKey:
			deliveryQk.deliveryPackingListByOrderInfoUUID(order_info_uuid),
		url: `/delivery/order-for-packing-list/${order_info_uuid}?${param}`,
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
//* For Delivery Vehicle
export const useDeliveryVehicle = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryVehicle(),
		url: '/delivery/vehicle',
	});

export const useDeliveryVehicleByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryVehicleByUUID(uuid),
		url: `/delivery/vehicle/${uuid}`,
	});

//* For Delivery Carton
export const useDeliveryCarton = () =>
	createGlobalState({
		queryKey: deliveryQk.deliveryCarton(),
		url: '/delivery/carton',
	});

export const useDeliveryCartonByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.deliveryCartonByUUID(uuid),
		url: `/delivery/carton/${uuid}`,
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
