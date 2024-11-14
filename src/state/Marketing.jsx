import createGlobalState from '.';
import { marketingQK } from './QueryKeys';

export const useMarketingTeams = () =>
	createGlobalState({
		queryKey: marketingQK.getTeams,
		url: '/public/marketing-team',
	});

export const useMarketingTeamDetails = (uuid) =>
	createGlobalState({
		queryKey: marketingQK.getTeamDetails(uuid),
		url: `/public/marketing-team-details/by/marketing-team-uuid/${uuid}`,
	});
