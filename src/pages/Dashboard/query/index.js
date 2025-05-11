import createGlobalState from '@/state';

import { dashboardQK } from './queryKeys';

// Dashboard Order Entry
export const useDashboardOrderEntry = (from, to) => {
	return createGlobalState({
		queryKey: dashboardQK.order_entry(from, to),
		url: `/dashboard/order-entry?from=${from}&to=${to}`,
	});
};

// Dashboard Amount and Doc
export const useDashboardAmountAndDoc = () =>
	createGlobalState({
		queryKey: dashboardQK.amount_and_doc(),
		url: '/dashboard/amount-and-doc',
	});

export const useDashboardAmountPercentage = () =>
	createGlobalState({
		queryKey: dashboardQK.amount_percentage(),
		url: '/dashboard/amount-percentage',
	});

export const useDashboardWorkInHand = () =>
	createGlobalState({
		queryKey: dashboardQK.work_in_hand(),
		url: '/dashboard/work-in-hand',
	});

export const useDashboardNoOfDoc = () =>
	createGlobalState({
		queryKey: dashboardQK.no_of_doc(),
		url: '/dashboard/no-of-doc',
	});

// Dashboard Payment Due
export const useDashboardPaymentDue = () =>
	createGlobalState({
		queryKey: dashboardQK.payment_due(),
		url: '/dashboard/payment-due',
	});

// Dashboard Maturity Due
export const useDashboardMaturityDue = () =>
	createGlobalState({
		queryKey: dashboardQK.maturity_due(),
		url: '/dashboard/maturity-due',
	});

// Dashboard Acceptance Due
export const useDashboardAcceptanceDue = () =>
	createGlobalState({
		queryKey: dashboardQK.acceptance_due(),
		url: '/dashboard/acceptance-due',
	});

// Dashboard Document Rcv Due
export const useDashboardDocumentRcvDue = () =>
	createGlobalState({
		queryKey: dashboardQK.document_rcv_due(),
		url: '/dashboard/document-rcv-due',
	});
