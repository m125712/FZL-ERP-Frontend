import Targets from '@/pages/Marketing/Targets';
import Teams from '@/pages/Marketing/Teams';
import TeamDetails from '@/pages/Marketing/Teams/Details';
import TeamsEntry from '@/pages/Marketing/Teams/Entry';

export const MarketingRoutes = [
	{
		name: 'Marketing',
		children: [
			{
				name: 'Teams',
				path: '/marketing/teams',
				element: <Teams />,
				page_name: 'marketing__teams',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Teams Entry',
				path: '/marketing/teams/entry',
				element: <TeamsEntry />,
				hidden: true,
				page_name: 'marketing__teams_entry',
				actions: ['create', 'read'],
			},
			{
				name: 'Teams Update',
				path: '/marketing/teams/:team_uuid/update',
				element: <TeamsEntry />,
				hidden: true,
				page_name: 'marketing__teams_entry_update',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Teams Details',
				path: '/marketing/teams/:team_uuid',
				element: <TeamDetails />,
				hidden: true,
				page_name: 'marketing__teams_details',
				actions: ['create', 'read', 'update', 'delete'],
			},

			// * Targets
			{
				name: 'Targets',
				path: '/marketing/targets',
				element: <Targets />,
				page_name: 'marketing__targets',
				actions: ['read', 'create', 'update', 'delete'],
			},
		],
	},
];
