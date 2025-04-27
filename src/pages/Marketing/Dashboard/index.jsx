import { useEffect, useMemo, useState } from 'react';
import { useMarketingDashboard } from '@/state/Marketing';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { LinkWithCopy, ReactSelect, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { BarChartOverall } from './Chart';

const options = [
	{
		value: 'team',
		url: '/dashboard/team-marketing-target-achievement/2025/team',
		label: 'Team',
	},
	{
		value: 'marketing',
		url: '/dashboard/team-marketing-target-achievement/2025/marketing',
		label: 'Marketing',
	},
];

export default function Index() {
	const [type, setType] = useState('team');
	const [year, setYear] = useState(String(new Date().getFullYear()));
	const { data, isLoading, url } = useMarketingDashboard(year, type);

	const info = new PageInfo('Dashboard', url, 'marketing__dashboard');
	const haveAccess = useAccess('marketing__dashboard');

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => {
					const month = new Date(row.month, 0).toLocaleString(
						'default',
						{ month: 'long' }
					);
					return month;
				},
				id: 'month',
				header: 'Month',
			},
			{
				accessorKey: 'teams',
				header: 'Target',
				cell: (info) => {
					const { teams } = info.row.original;
					return (
						<div className='flex flex-col gap-1'>
							{teams.map((item, index) => {
								return (
									<div
										key={index}
										className='flex flex-col gap-2'
									>
										<span className='text-sm font-semibold text-primary'>
											{item.name}
										</span>
										<span>
											Zipper:{' '}
											{item.achievement_for_zipper}
											{' / '}
											{item.target_for_zipper}
										</span>
										<span>
											Thread:{' '}
											{item.achievement_for_thread}
											{' / '}
											{item.target_for_thread}
										</span>
									</div>
								);
							})}
						</div>
					);
				},
			},
		],
		[data]
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<div className='flex w-full items-center gap-2'>
				<SimpleDatePicker
					value={year}
					placeholder='Year'
					minDate={new Date(2024, 0, 1)}
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
