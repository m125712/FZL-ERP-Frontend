import createGlobalState from '.';
import { reportQK } from './QueryKeys';

//* Stock
export const useReportStock = (from, to, { enabled = false }) =>
	createGlobalState({
		queryKey: reportQK.stock(from, to),
		url: `/report/material-stock-report?from_date=${from}&to_date=${to}`,
		enabled,
	});

export const useReportStoreApproved = () =>
	createGlobalState({
		queryKey: reportQK.storeApproved(),
		url: `/report/item-zipper-number-end-wise-approved`,
	});

export const useProductionReportDateWise = (
	from = '',
	to = '',
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportDateWise(from, to, query),
		url:
			`/report/daily-production-report?from_date=${from}&to_date=${to}&` +
			query,
		enabled: !!from && !!to && enabled,
	});
export const useProductionStatementReport = (
	from = '',
	to = '',
	party = '',
	marketing = '',
	type = '',
	order = '',
	reportFor = '',
	query,
	{ isEnabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportStatementReport(
			from,
			to,
			party,
			marketing,
			type,
			order,
			reportFor,
			query
		),
		url: query
			? `/report/delivery-statement-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&order_info_uuid=${order}&type=${type}&report_for=${reportFor}&${query}`
			: `/report/delivery-statement-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&order_info_uuid=${order}&type=${type}&report_for=${reportFor}`,
		enabled: !!from && !!to && isEnabled,
	});

export const useOrderStatementReport = (
	from = '',
	to = '',
	party = '',
	marketing = '',
	type = '',
	query = '',
	{ isEnabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.orderStatementReport(
			from,
			to,
			party,
			marketing,
			type,
			query
		),
		url: query
			? `/report/order-sheet-pdf-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&type=${type}&${query}`
			: `/report/order-sheet-pdf-report?from_date=${from}&to_date=${to}&party=${party}&marketing=${marketing}&type=${type}`,
		enabled: !!from && !!to && isEnabled,
	});

export const useZipperProduction = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.zipperProduction(query),
		url: '/report/zipper-production-status-report?' + query,
		enabled,
	});

export const useThreadProductionBatchWise = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.threadProductionBatchWise(query),
		url: '/report/thread-production-batch-wise-report?' + query,
		enabled,
	});

export const useThreadProductionOrderWise = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.threadProductionOrderWise(query),
		url: '/report/thread-production-status-order-wise?' + query,
		enabled,
	});

export const useDailyChallan = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.dailyChallan(query),
		url: '/report/daily-challan-report?' + query,
		enabled,
	});

export const useThreadStatus = (from, to, query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.threadStatus(query, from, to),
		url:
			`/report/production-report-thread-sales-marketing?from=${from}&to=${to}&` +
			query,
		enabled,
	});

export const useZipperStatus = (from, to, query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.zipperStatus(query, from, to),
		url:
			`/report/production-report-sales-marketing?from=${from}&to=${to}&` +
			query,
		enabled,
	});

export const usePIRegister = (
	query,
	{ enabled = false } = { enabled: false }
) =>
	createGlobalState({
		queryKey: reportQK.piRegister(query),
		url: '/report/pi-register-report?' + query,
		enabled,
	});

export const usePIToBeSubmitted = (
	query,
	{ enabled = false } = { enabled: false }
) =>
	createGlobalState({
		queryKey: reportQK.piToBeSubmitted(query),
		url: '/report/pi-to-be-register-report?' + query,
		enabled,
	});

export const useLC = (url, { enabled = false } = {}) => {
	return createGlobalState({
		queryKey: reportQK.lc(url),
		url,
		enabled,
	});
};

export const useProductionReport = (url, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.productionReport(url),
		url: `/report/production-report-${url}`,
		enabled,
	});
export const useDeliveryStatement = (url, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: reportQK.deliveryStatement(url),
		url: `/report/delivery-statement-report?` + url,
		enabled,
	});

export const useProductionReportThreadPartyWise = (
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.productionReportThreadPartyWise(query),
		url: `/report/production-report-thread-party-wise?` + query,
		enabled,
	});

export const useSample = (
	date,
	toDate,
	is_sample = 1,
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.sample(date, toDate, is_sample, query),
		url: query
			? `/report/sample-report-by-date?date=${date}&to_date=${toDate}&is_sample=${is_sample}` +
				query
			: `/report/sample-report-by-date?date=${date}&to_date=${toDate}&is_sample=${is_sample}`,
		enabled,
	});

export const useSampleCombined = (
	date,
	is_sample = 1,
	query,
	{ enabled = false } = {}
) =>
	createGlobalState({
		queryKey: reportQK.sampleCombined(date, is_sample, query),
		url: query
			? `/report/sample-report-by-date-combined?date=${date}&is_sample=${is_sample}` +
				query
			: `/report/sample-report-by-date-combined?date=${date}&is_sample=${is_sample}`,
		enabled,
	});
