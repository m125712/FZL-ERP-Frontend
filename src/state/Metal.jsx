import createGlobalState from '.';
import { metalQK } from './QueryKeys';

//*Teeth Molding

// * PRODUCTION
export const useMetalTMProduction = () =>
	createGlobalState({
		queryKey: metalQK.metalTMProduction(),
		url: '/zipper/sfg/by/teeth_molding_prod?item_name=metal',
	});

//* Trx Log
export const useMetalTMTrxLog = () =>
	createGlobalState({
		queryKey: metalQK.metalTMTrxLog(),
		url: '/zipper/sfg-transaction/by/teeth_molding_prod?item_name=metal',
	});

export const useMetalTMTrxLogByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: metalQK.metalTMTrxLogByUUID(uuid),
		url: `/zipper/sfg-transaction/${uuid}`,
		enabled: enabled,
	});

//* Production Log
export const useMetalTMProductionLog = () =>
	createGlobalState({
		queryKey: metalQK.metalTMProductionLog(),
		url: '/zipper/sfg-production/by/teeth_molding?item_name=metal',
	});
export const useMetalTMProductionLogByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: metalQK.metalTMProductionLogByUUID(uuid),
		url: `/zipper/sfg-production/${uuid}`,
		enabled: enabled,
	});
//* Tape Log

export const useMetalTMTapeLog = () =>
	createGlobalState({
		queryKey: metalQK.metalTMTapeLog(),
		url: '/zipper/dyed-tape-transaction/by/metal_teeth_molding',
	});

export const useMetalTMTapeLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: metalQK.metalTMTapeLogByUUID(uuid),
		url: `/zipper/dyed-tape-transaction/by/metal_teeth_molding${uuid}`,
	});

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

// * PRODUCTION
export const useMetalTCProduction = () =>
	createGlobalState({
		queryKey: metalQK.metalTCProduction(),
		url: '/zipper/sfg/by/teeth_coloring_prod?item_name=metal',
	});

//* Trx Log
export const useMetalTCTrxLog = () =>
	createGlobalState({
		queryKey: metalQK.metalTCTrxLog(),
		url: '/zipper/sfg-transaction/by/teeth_coloring_prod?item_name=metal',
	});

export const useMetalTCTrxLogByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: metalQK.metalTCTrxLogByUUID(uuid),
		url: `/zipper/sfg-transaction/${uuid}`,
		enabled: enabled,
	});

//* Production Log
export const useMetalTCProductionLog = () =>
	createGlobalState({
		queryKey: metalQK.metalTCProductionLog(),
		url: '/zipper/sfg-production/by/teeth_coloring?item_name=metal',
	});
export const useMetalTCProductionLogByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: metalQK.metalTCProductionLogByUUID(uuid),
		url: `/zipper/sfg-production/${uuid}`,
		enabled: enabled,
	});

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

// * Finishing production log
export const useMetalFinishingProdLog = () =>
	createGlobalState({
		queryKey: metalQK.metalFinishingProdLog(),
		url: '/zipper/sfg-production/by/finishing?item_name=metal',
	});

// * Finishing transaction log
export const useMetalFinishingTrxLog = () =>
	createGlobalState({
		queryKey: metalQK.metalFinishingTrxLog(),
		url: '/zipper/sfg-transaction/by/finishing_prod?item_name=metal',
	});

