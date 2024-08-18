import createGlobalState from '@/state';
import { dyeingQK } from './QueryKeys';

// * Info
export const useDyeingSwatch = () =>
	createGlobalState({
		queryKey: dyeingQK.swatch(),
		url: '/zipper/sfg-swatch',
	});

export const useDyeingSwatchByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.swatchByUUID(uuid),
		url: `/zipper/sfg-swatch/${uuid}`,
	});

// * Planning_sno
export const useDyeingPlanningSNO = () =>
	createGlobalState({
		queryKey: dyeingQK.planning_sno(),
		url: '/zipper/planning',
	});

export const useDyeingPlanningSNOByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.swatchByUUID(uuid),
		url: `/zipper/planning/${uuid}`,
	});
