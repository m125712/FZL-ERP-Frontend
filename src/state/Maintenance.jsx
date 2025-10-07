import createGlobalState from '.';
import { maintenanceQK } from './QueryKeys';

// * Info
export const useMaintenanceMachine = () =>
	createGlobalState({
		queryKey: maintenanceQK.machine(),
		url: `/maintain/section-machine`,
	});

export const useMaintenanceMachineByUUID = (uuid) =>
	createGlobalState({
		queryKey: maintenanceQK.machineByUUID(uuid),
		url: `/maintain/section-machine/${uuid}`,
	});

export const useIssue = (query) =>
	createGlobalState({
		queryKey: maintenanceQK.issue(query),
		url: query ? `/maintain/issue?${query}` : `/maintain/issue`,
	});

export const useIssueByUUID = (uuid) =>
	createGlobalState({
		queryKey: maintenanceQK.issueByUUID(uuid),
		url: `/maintain/issue/${uuid}`,
		enabled: !!uuid,
	});

export const useIssueProcurement = () =>
	createGlobalState({
		queryKey: maintenanceQK.issueProcurement(),
		url: `/maintain/issue-procurement`,
	});

export const useIssueProcurementByUUID = (uuid) =>
	createGlobalState({
		queryKey: maintenanceQK.issueProcurementByUUID(uuid),
		url: `/maintain/issue-procurement/${uuid}`,
		enabled: !!uuid,
	});

export const useProcurementByIssueUUID = (uuid) =>
	createGlobalState({
		queryKey: maintenanceQK.procurementByIssueUUID(uuid),
		url: `/maintain/issue-procurement/by/${uuid}`,
		enabled: !!uuid,
	});
export const useDashboard = () =>
	createGlobalState({
		queryKey: maintenanceQK.dashboard(),
		url: `/maintain/maintenance/dashboard`,
	});
