import createGlobalState from '.';
import { commonQK } from './QueryKeys';

// * TAPE * //
// * SFG * //
export const useCommonTapeSFG = () =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(),
		url: `/zipper/tape-coil`,
	});
export const useCommonTapeSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(uuid),
		url: `/zipper/tape-coil${uuid}`,
	});

// * PRODUCTION * //
export const useCommonTapeProduction = () =>
	createGlobalState({
		queryKey: commonQK.tapeProduction(),
		url: `/zipper/tape-coil-production/by/tape`,
	});
export const useCommonTapeProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeProduction(uuid),
		url: `/zipper/tape-coil-production/by/tape${uuid}`,
	});

// * TAPE TO COIL * //
export const useCommonTapeToCoil = () =>
	createGlobalState({
		queryKey: commonQK.tapeToCoil(),
		url: `/zipper/tape-to-coil`,
	});
export const useCommonTapeToCoilByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeToCoil(uuid),
		url: `/zipper/tape-to-coil${uuid}`,
	});

// * COIL * //
// * SFG * //
export const useCommonCoilSFG = () =>
	createGlobalState({
		queryKey: commonQK.coilSFG(),
		url: `/zipper/tape-coil/by/nylon`,
	});

export const useCommonCoilSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilSFG(uuid),
		url: `/zipper/tape-coil/by/nylon${uuid}`,
	});

// * PRODUCTION * //
export const useCommonCoilProduction = () =>
	createGlobalState({
		queryKey: commonQK.coilProduction(),
		url: `/zipper/tape-coil-production/by/coil`,
	});
export const useCommonCoilProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilProduction(uuid),
		url: `/zipper/tape-coil-production/by/coil/${uuid}`,
	});
//* RM *//
export const useCommonCoilRM = () =>
	createGlobalState({
		queryKey: commonQK.coilRM(),
		url: `/material/stock/by/single-field/coil_forming`,
	});
export const useCommonCoilRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.coilRM(uuid),
		url: `/material/stock/by/single-field/coil_forming${uuid}`,
	});
