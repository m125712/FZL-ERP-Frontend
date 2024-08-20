import createGlobalState from '.';
import { deliveryQk } from './QueryKeys';

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
		url: '/zipper/material-trx-against-order/by/m_qc_and_packing',
	});
export const useOrderAgainstDeliveryRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: deliveryQk.orderAgainstDeliveryRMLogByUUID(uuid),
		url: '/zipper/material-trx-against-order/by/m_qc_and_packing',
	});