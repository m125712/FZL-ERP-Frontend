import createGlobalState from '.';
import { commonQK } from './QueryKeys';

export const useCommonTapeSFG = () =>
	createGlobalState({
		queryKey: commonQK.tapeSFG(),
		url: `/zipper/tape-coil`,
	});
export const useCommonTapeSFGByUUID = (uuid) =>
	createGlobalState({
		queryKey: libraryQK.tapeSFG(uuid),
		url: `/zipper/tape-coil${uuid}`,
	});
