import createGlobalState from '.';
import { materialQK } from './QueryKeys';

// * Section * //
export const useMaterialSection = () =>
	createGlobalState({
		queryKey: materialQK.sections(),
		url: '/material/section',
	});

export const useMaterialSectionByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.section(uuid),
		url: `/material/section/${uuid}`,
	});
