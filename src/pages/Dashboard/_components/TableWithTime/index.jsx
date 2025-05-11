import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { defaultFetch } from '@/hooks';

import Loader from '@/components/layout/loader';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const daysMap = {
	yesterday: 1,
	last_seven_days: 7,
	last_fifteen_days: 15,
	last_thirty_days: 30,
};

export function TableWithTime(props) {
	const [time, setTime] = useState('yesterday');
	const [dateRange, setDateRange] = useState({ from: '', to: '' });

	useEffect(() => {
		const to = format(addDays(new Date(), -1), 'yyyy-MM-dd');
		const from = format(
			addDays(new Date(), -(daysMap[time] || 1)),
			'yyyy-MM-dd'
		);
		setDateRange({ from, to });
	}, [time]);

	const { data, isLoading } = useQuery({
		queryKey: [props?.url, props.status, dateRange.from, dateRange.to],
		queryFn: () =>
			defaultFetch(
				props?.time
					? `${props?.url}?start_date=${dateRange.from}&end_date=${dateRange.to}`
					: props?.url
			).then((res) => res?.data),
	});

	const tableColumns = useMemo(() => [...props?.columns], [props?.columns]);
	const tableData = useMemo(() => data?.chart_data || data || [], [data]);

	const handleTimeChange = (e) => {
		setTime(e.target.value);
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<Card className='w-full'>
			<CardHeader className='py-3'>
				<CardTitle className='flex items-center justify-between text-[16px] lg:text-xl'>
					<div className='flex items-center gap-2'>
						<div>
							{props.title}{' '}
							{props?.total && `#${data?.total_number}`}
						</div>
					</div>
					<div>
						{props?.time ? (
							<select
								name='time'
								className='select select-secondary h-8 min-h-0 border-secondary/30 bg-base-200 transition-all duration-100 ease-in-out'
								value={time}
								onChange={handleTimeChange}
							>
								<option value='yesterday'>Yesterday</option>
								<option value='last_seven_days'>7 Days</option>
								<option value='last_fifteen_days'>
									15 Days
								</option>
								<option value='last_thirty_days'>
									30 Days
								</option>
							</select>
						) : (
							<div className='flex items-center gap-2'>
								<span className='live-indicator space-x-2'>
									<span className='live-dot'></span>
									<span className='live-text'> Live</span>
								</span>
							</div>
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className=''>
				{isLoading ? (
					<span className='loading loading-dots loading-lg z-50' />
				) : (
					<ReactTableTitleOnly
						// title={props?.title}
						columns={tableColumns}
						data={tableData}
					/>
				)}
			</CardContent>
		</Card>
	);
}
