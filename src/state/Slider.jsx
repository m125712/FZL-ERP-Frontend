import createGlobalState from '.';
import { sliderQK } from './QueryKeys';

// * Slider Assembly

// * RM
export const useSliderAssemblyRM = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRM(),
		url: '/material/stock/by/single-field/slider_assembly',
	});

export const useSliderAssemblyRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRMByUUID(uuid),
		url: `/material/stock/by/single-field/slider_assembly${uuid}`,
	});
// * RM Log
export const useSliderAssemblyRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRMLog(),
		url: '/material/used/by/slider_assembly',
	});
export const useSliderAssemblyRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderAssemblyRMLogByUUID(uuid),
		url: `/material/used/by/slider_assembly${uuid}`,
	});

// * Slider/Dashboard --> (Info)
export const useSliderDashboardInfo = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDashboardInfo(),
		url: '/slider/stock',
	});

export const useSliderDashboardInfoByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: sliderQK.sliderDashboardInfoByUUID(uuid),
		url: `/slider/stock/${uuid}`,
		enabled,
	});

// * Die Casting --> (STOCK)
export const useSliderDieCastingStock = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingStock(),
		url: '/slider/die-casting',
	});

// * Die Casting --> (PRODUCTION)
export const useSliderDieCastingProduction = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingProduction(),
		url: '/slider/die-casting-production',
	});

export const useSliderDieCastingProductionByUUID = (uuid, { enabled = true }) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingProductionByUUID(uuid),
		url: `/slider/die-casting-production/${uuid}`,
		enabled,
	});

// * Order Against RM Log
export const useOrderAgainstSliderAssemblyRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderAssemblyRMLog(),
		url: '/zipper/material-trx-against-order/by/slider_assembly',
	});
export const useOrderAgainstSliderAssemblyRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderAssemblyRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/slider_assembly${uuid}`,
	});
// * Die Casting
// * RM
export const useSliderDieCastingRM = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRM(),
		url: '/material/stock/by/single-field/die_casting',
	});
export const useSliderDieCastingRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRMByUUID(uuid),
		url: `/material/stock/by/single-field/die_casting${uuid}`,
	});
// * RM Log
export const useSliderDieCastingRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRMLog(),
		url: '/material/used/by/die_casting',
	});
export const useSliderDieCastingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderDieCastingRMLogByUUID(uuid),
		url: `/material/used/by/die_casting${uuid}`,
	});
// * Order Against RM Log
export const useOrderAgainstDieCastingRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstDieCastingRMLog(),
		url: '/zipper/material-trx-against-order/by/die_casting',
	});
export const useOrderAgainstDieCastingRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstDieCastingRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/die_casting${uuid}`,
	});
// * Coloring

// * RM
export const useSliderColoringRM = () =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRM(),
		url: '/material/stock/by/single-field/coloring',
	});
export const useSliderColoringRMByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRMByUUID(uuid),
		url: `/material/stock/by/single-field/coloring${uuid}`,
	});
// * RM Log
export const useSliderColoringRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRMLog(),
		url: '/material/used/by/coloring',
	});
export const useSliderColoringRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.sliderColoringRMLogByUUID(uuid),
		url: `/material/used/by/coloring${uuid}`,
	});
// * Order Against RM Log
export const useOrderAgainstSliderColorRMLog = () =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderColorRMLog(),
		url: '/zipper/material-trx-against-order/by/coloring',
	});
export const useOrderAgainstSliderColorRMLogByUUID = (uuid) =>
	createGlobalState({
		queryKey: sliderQK.orderAgainstSliderColorRMLogByUUID(uuid),
		url: `/zipper/material-trx-against-order/by/coloring${uuid}`,
	});
