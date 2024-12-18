import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/Marketing/Dashboard'));
const Teams = lazy(() => import('@/pages/Marketing/Teams'));
const TeamsEntry = lazy(() => import('@/pages/Marketing/Teams/Entry'));
const TeamDetails = lazy(() => import('@/pages/Marketing/Teams/Details'));
const Targets = lazy(() => import('@/pages/Marketing/Targets'));

export const MarketingRoutes = [
	{
		name: 'Marketing',
		children: [
			{
				name: 'Dashboard',
				path: '/marketing/dashboard',
				element: <Dashboard />,
				page_name: 'marketing__dashboard',
				actions: ['read'],
			},
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
