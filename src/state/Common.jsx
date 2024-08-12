import createGlobalState from '.';
import { commonQK } from './QueryKeys';

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
export const useCommonTapeProduction = () =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(),
		url: `/zipper/tape-coil-production`,
	});
export const useCommonTapeProductionByUUID = (uuid) =>
	createGlobalState({
		queryKey: commonQK.tapeProduction(uuid),
		url: `/zipper/tape-coil-production${uuid}`,
	});
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
