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
