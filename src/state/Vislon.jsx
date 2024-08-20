import createGlobalState from '.';
import { vislonQK } from './QueryKeys';

//*Teeth Molding
// * RM
export const useVislonTMRM = () =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRM(),
		url: '/material/stock/by/single-field/v_teeth_molding',
	});
export const useVislonTMRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRMByUUID(uuid),
		url: `/material/stock/by/single-field/v_teeth_molding${uuid}`,
	});
//* RM Log
export const useVislonTMRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRMLog(),
		url: '/material/used/by/v_teeth_molding',
	});
export const useVislonTMRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonTMRMLogByUUID(uuid),
		url: `/material/used/by/v_teeth_molding${uuid}`,
	});
//* order against RM Log
export const useOrderAgainstVislonTMRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonTMRMLog(),
		url: '/zipper/material-trx-against-order/by/v_teeth_molding',
	});
export const useOrderAgainstVislonTMRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonTMRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/v_teeth_molding${uuid}`,
	});

//* Finishing
// * RM
export const useVislonFinishingRM = () =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRM(),
		url: '/material/stock/by/multi-field/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper',
	});
export const useVislonFinishingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRMByUUID(uuid),
		url: `/material/stock/by/multi-field/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper/${uuid}`,
	});
//* RM Log
export const useVislonFinishingRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRMLog(),
		url: '/material/used/multi-section/by/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper',
	});
export const useVislonFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.VislonFinishingRMLogByUUID(uuid),
		url: `/material/used/multi-section/by/v_gapping,v_teeth_cleaning,v_sealing,v_t_cutting,v_stopper/${uuid}`,
	});
//* order against RM Log
export const useOrderAgainstVislonFinishingRMLog = () =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonFinishingRMLog(),
		url: '/zipper/material-trx-against-order/by/v_gapping',
	});
export const useOrderAgainstVislonFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: vislonQK.orderAgainstVislonFinishingRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/v_gapping${uuid}`,
	});
