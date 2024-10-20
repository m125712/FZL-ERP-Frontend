import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { useFetch } from '@/hooks';

import Table from '@/components/Table';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';

const daysMap = {
	yesterday: 1,
	last_seven_days: 7,
	last_fifteen_days: 15,
	last_thirty_days: 30,
};

export function TableWithTime(props) {
	const [time, setTime] = useState('yesterday');

	let to = format(addDays(new Date(), -1), 'yyyy-MM-dd');
	let from = format(addDays(new Date(), -daysMap[time] || 1), 'yyyy-MM-dd');

	const { value: data } = useFetch(
		props.time
			? `${props?.url}?start_date=${from}&end_date=${to}`
			: `${props?.url}`,
		[from, to]
	);
	const table_columns = useMemo(
		() => [...props?.columns],
		[data?.chart_data ? data?.chart_data : data]
	);
	return (
		<>
			<div className='flex items-center justify-between'>
				{props?.total && (
					<div className='rounded-md border border-secondary/30 bg-base-200 px-3 py-1'>
						<span className='text-sm font-semibold'>
							{props?.total_title}: {data?.total_number}
						</span>
					</div>
				)}
				{props?.time ? (
					<select
						name='time'
						className='select select-secondary h-8 min-h-0 border-secondary/30 bg-base-200 transition-all duration-100 ease-in-out'
						value={time}
						onChange={(e) => setTime(e.target.value)}>
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
			<br />
			<ReactTableTitleOnly
				columns={table_columns}
				data={data?.chart_data ? data?.chart_data : data}
				extraClass='table-with-time'
			/>
		</>
	);
}
