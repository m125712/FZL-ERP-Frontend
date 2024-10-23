import React, { useEffect, useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { useFetch } from '@/hooks';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';

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

	const fetchUrl = useMemo(() => {
		if (props?.time) {
			return `${props?.url}?start_date=${dateRange.from}&end_date=${dateRange.to}`;
		}
		return props?.url;
	}, [props?.url, props?.time, dateRange]);

	const { value: data, isLoading } = useFetch(fetchUrl, [fetchUrl]);

	const tableColumns = useMemo(() => [...props?.columns], [props?.columns]);
	const tableData = useMemo(() => data?.chart_data || data || [], [data]);

	const handleTimeChange = (e) => {
		setTime(e.target.value);
	};

	return (
		<>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					{props?.total && (
						<div className='rounded-md border border-secondary/30 bg-base-200 px-3 py-1'>
							<span className='text-sm font-semibold'>
								{props?.total_title}: {data?.total_number || 0}
							</span>
						</div>
					)}
					{props?.total2 && (
						<div className='rounded-md border border-secondary/30 bg-base-200 px-3 py-1'>
							<span className='text-sm font-semibold'>
								{props?.total2_title}: {data?.total_amount || 0}
							</span>
						</div>
					)}
				</div>
				<div>
					{props?.time ? (
						<select
							name='time'
							className='select select-secondary h-8 min-h-0 border-secondary/30 bg-base-200 transition-all duration-100 ease-in-out'
							value={time}
							onChange={handleTimeChange}>
							<option value='yesterday'>Yesterday</option>
							<option value='last_seven_days'>7 Days</option>
							<option value='last_fifteen_days'>15 Days</option>
							<option value='last_thirty_days'>30 Days</option>
						</select>
					) : (
						<span className='live-indicator'>
							(<span className='live-dot'></span>
							<span className='live-text'> Live</span>)
						</span>
					)}
				</div>
			</div>
			<br />
			{isLoading ? (
				<span className='loading loading-dots loading-lg z-50' />
			) : (
				<ReactTableTitleOnly
					title={props?.title}
					columns={tableColumns}
					data={tableData}
				/>
			)}
		</>
	);
}
