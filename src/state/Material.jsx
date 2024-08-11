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

// * Types * //
export const useMaterialType = () =>
	createGlobalState({
		queryKey: materialQK.types(),
		url: '/material/type',
	});

export const useMaterialTypeByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.type(uuid),
		url: `/material/type/${uuid}`,
	});

// * Info * //
export const useMaterialInfo = () =>
	createGlobalState({
		queryKey: materialQK.infos(),
		url: '/material/info',
	});

export const useMaterialInfoByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.infos(uuid),
		url: `/material/info/${uuid}`,
	});
