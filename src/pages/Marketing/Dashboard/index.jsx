import { useEffect, useMemo, useState } from 'react';
import { useMarketingDashboard } from '@/state/Marketing';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy, ReactSelect, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { BarChartOverall } from './Chart';

export default function Index() {
	const [type, setType] = useState('team');
	const [year, setYear] = useState(String(new Date().getFullYear()));
	const { data, isLoading, url } = useMarketingDashboard(type);

	const info = new PageInfo('Dashboard', url, 'marketing__dashboard');
	const haveAccess = useAccess('marketing__dashboard');
	const val = [
		{
			team_name: 'Team 1',
			marketing_uuid: 'igD0v9DIJQhJeet',
			marketing_name: 'Marketing 1',
			is_team_leader: true,
			zipper_target: 1000,
			thread_target: 1000,
			year: 2021,
			zipper_achievement: 1000,
			thread_achievement: 1000,
		},
	];

	const columns = useMemo(
		() => [
			{
				accessorKey: 'team_name',
				header: 'Cash Invoice ID',
				cell: (info) => {
					const { challan_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={challan_uuid}
							uri='/delivery/challan'
						/>
					);
				},
			},

			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri='/order/details'
					/>
				),
			},
			{
				accessorKey: 'value',
				header: 'Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_amount',
				header: 'Receive amount',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	const options = [
		{
			value: 'team',
			url: '/dashboard/team-marketing-target-achievement/2024/team',
			label: 'Team',
		},
		{
			value: 'marketing',
			url: '/dashboard/team-marketing-target-achievement/2024/marketing',
			label: 'Marketing',
		},
	];

	const teamWise = [
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
		{
			month: 'January',
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
	];

	const mearketingWise = [
		{
			month: 'January',
			marketing: [
				{
					name: 'Joy Pondit',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Al-Amin',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
			teams: [
				{
					name: 'Team 1',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
				{
					name: 'Team 2',
					target_for_zipper: 1000,
					target_for_thread: 1000,
					achievement_for_zipper: 1000,
					achievement_for_thread: 1000,
				},
			],
		},
	];

	return (
		<>
			<div className='flex w-full items-center gap-2'>
				<SimpleDatePicker
					value={year}
					placeholder='Year'
					minDate={new Date(2000, 0, 1)}
					onChange={(data) => {
						setYear(format(data, 'yyyy'));
					}}
					dateFormat='yyyy'
					showYearPicker
				/>
				<ReactSelect
					placeholder='Select LC Due'
					options={options}
					value={options?.find((item) => item.value == type)}
					onChange={(e) => {
						setType(e.value);
					}}
				/>
			</div>

			<ReactTable title={info.getTitle()} data={data} columns={columns} />

			{/* <BarChartOverall /> */}
		</>
	);
}
