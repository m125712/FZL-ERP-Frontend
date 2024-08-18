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
//* RM
export const useDyeingRM = () =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRM(),
		url: `/material/stock/by/single-field/dying_and_iron`,
	});
export const useDyeingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRM(uuid),
		url: `/material/stock/by/single-field/dying_and_iron/${uuid}`,
	});
//* RM Log
export const useDyeingRMLog = () =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRMLog(),
		url: `/material/used/by/dying_and_iron`,
	});
export const useDyeingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: dyeingQK.dyeingRMLog(uuid),
		url: `/material/used/by/dying_and_iron${uuid}`,
	});
