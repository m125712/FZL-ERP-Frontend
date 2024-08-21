import createGlobalState from '.';
import { metalQK } from './QueryKeys';

//*Teeth Molding
// * RM
export const useMetalTMRM = () =>
	createGlobalState({
		queryKey: metalQK.metalTMRM(),
		url: '/material/stock/by/single-field/m_teeth_molding',
	});
export const useMetalTMRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.metalTMRMByUUID(uuid),
		url: `/material/stock/by/single-field/m_teeth_molding${uuid}`,
	});
//* RM Log
export const useMetalTMRMLog = () =>
	createGlobalState({
		queryKey: metalQK.metalTMRMLog(),
		url: '/material/used/by/m_teeth_molding',
	});
export const useMetalTMRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.metalTMRMLogByUUID(uuid),
		url: `/material/used/by/m_teeth_molding${uuid}`,
	});
//* order against RM Log
export const useOrderAgainstMetalTMRMLog = () =>
	createGlobalState({
		queryKey: metalQK.orderAgainstMetalTMRMLog(),
		url: '/zipper/material-trx-against-order/by/m_teeth_molding',
	});
export const useOrderAgainstMetalTMRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.orderAgainstMetalTMRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/m_teeth_molding${uuid}`,
	});
//* Teeth Coloring
// * RM
export const useMetalTCRM = () =>
	createGlobalState({
		queryKey: metalQK.metalTCRM(),
		url: '/material/stock/by/multi-field/teeth_assembling_and_polishing,plating_and_iron',
	});
export const useMetalTCRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.metalTCRMByUUID(uuid),
		url: `/material/stock/by/multi-field/teeth_assembling_and_polishing,plating_and_iron${uuid}`,
	});
//* RM Log
export const useMetalTCRMLog = () =>
	createGlobalState({
		queryKey: metalQK.metalTCRMLog(),
		url: '/material/used/multi-section/by/teeth_assembling_and_polishing,plating_and_iron',
	});
export const useMetalTCRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.metalTCRMLogByUUID(uuid),
		url: `/material/used/multi-section/by/teeth_assembling_and_polishing,plating_and_iron${uuid}`,
	});
//* order against RM Log
export const useOrderAgainstMetalTCRMLog = () =>
	createGlobalState({
		queryKey: metalQK.orderAgainstMetalTCRMLog(),
		url: '/zipper/material-trx-against-order/multiple/by/teeth_assembling_and_polishing,plating_and_iron',
	});
export const useOrderAgainstMetalTCRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.orderAgainstMetalTCRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/multiple/by/teeth_assembling_and_polishing,plating_and_iron${uuid}`,
	});
//* Finishing
// * RM
export const useMetalFinishingRM = () =>
	createGlobalState({
		queryKey: metalQK.metalFinishingRM(),
		url: '/material/stock/by/multi-field/m_gapping,m_teeth_cleaning,m_sealing,m_stopper',
	});
export const useMetalFinishingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.metalFinishingRMByUUID(uuid),
		url: `/material/stock/by/multi-field/m_gapping,m_teeth_cleaning,m_sealing,m_stopper/${uuid}`,
	});
//* RM Log
export const useMetalFinishingRMLog = () =>
	createGlobalState({
		queryKey: metalQK.metalFinishingRMLog(),
		url: '/material/used/multi-section/by/m_gapping,m_teeth_cleaning,m_sealing,m_stopper',
	});
export const useMetalFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.metalFinishingRMLogByUUID(uuid),
		url: `/material/used/multi-section/by/m_gapping,m_teeth_cleaning,m_sealing,m_stopper/${uuid}`,
	});
//* order against RM Log
export const useOrderAgainstMetalFinishingRMLog = () =>
	createGlobalState({
		queryKey: metalQK.orderAgainstMetalFinishingRMLog(),
		url: '/zipper/material-trx-against-order/multiple/by/m_gapping,m_teeth_cleaning,m_sealing,m_stopper',
	});
export const useOrderAgainstMetalFinishingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.orderAgainstMetalFinishingRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/multiple/by/m_gapping,m_teeth_cleaning,m_sealing,m_stopper${uuid}`,
	});
