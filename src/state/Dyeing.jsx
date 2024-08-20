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
export const useDyeingPlanning = () =>
	createGlobalState({
		queryKey: dyeingQK.planning(),
		url: '/zipper/planning',
	});

export const useDyeingPlanningByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.planningByUUID(uuid),
		url: `/zipper/planning/${uuid}`,
	});
