import createGlobalState from '.';
import { marketingQK } from './QueryKeys';

// * Marketing Teams * //
export const useMarketingDashboard = (year, type) =>
	createGlobalState({
		queryKey: marketingQK.getDashboard(year, type),
		url: `/dashboard/team-marketing-target-achievement/${year}/${type}`,
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
export const useMarketingTargets = (query, { enabled = false } = {}) =>
	createGlobalState({
		queryKey: marketingQK.getTargets(query),
		url: query
			? `/public/marketing-team-member-target?${query}`
			: '/public/marketing-team-member-target',
		enabled: enabled,
	});

export const useMarketingTargetDetails = (uuid) =>
	createGlobalState({
		queryKey: marketingQK.getTargetDetails(uuid),
		url: `/public/marketing-team-member-target/${uuid}`,
	});
