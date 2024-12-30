import createGlobalState from '.';
import { marketingQK } from './QueryKeys';

// * Marketing Teams * //
export const useMarketingDashboard = (type) =>
	createGlobalState({
		queryKey: marketingQK.getDashboard(type),
		url: `/dashboard/team-marketing-target-achievement/${type}`,
	});

// * Marketing Teams * //
export const useMarketingTeams = () =>
	createGlobalState({
		queryKey: marketingQK.getTeams(),
		url: '/public/marketing-team',
	});

export const useMarketingTeamDetails = (uuid) =>
	createGlobalState({
		queryKey: marketingQK.getTeamDetails(uuid),
		url: `/public/marketing-team-details/by/marketing-team-uuid/${uuid}`,
	});

// * Marketing Targets* //
export const useMarketingTargets = () =>
	createGlobalState({
		queryKey: marketingQK.getTargets(),
		url: '/public/marketing-team-member-target',
	});

export const useMarketingTargetDetails = (uuid) =>
	createGlobalState({
		queryKey: marketingQK.getTargetDetails(uuid),
		url: `/public/marketing-team-member-target/${uuid}`,
	});
