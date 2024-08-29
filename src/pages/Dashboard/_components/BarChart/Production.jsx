import { BarChart } from '@/components/Chart';
import { useFetch } from '@/hooks';
import { addDays, format } from 'date-fns';
import { useState } from 'react';
import { primaryColor } from '../../_utils';

const daysMap = {
	yesterday: 1,
	last_seven_days: 7,
	last_fifteen_days: 15,
	last_thirty_days: 30,
};

export default function StatusBarChart() {
	const [time, setTime] = useState('yesterday');

	let to = format(addDays(new Date(), -1), 'yyyy-MM-dd');
	let from = format(addDays(new Date(), -daysMap[time] || 1), 'yyyy-MM-dd');

	const { value: production } = useFetch(
		`/dashboard/production/${from}/${to}`,
		[from, to]
	);

	const totals = production?.reduce((acc, item) => {
		const key = `${item.item_name}_${item.stopper_name}`;
		acc[key] = item.total;
		return acc;
	}, {});

	const nylon_metallic = totals?.['nylon_metallic'] ?? 0;
	const nylon_plastic = totals?.['nylon_plastic'] ?? 0;
	const vislon_ = totals?.['vislon_'] ?? 0;
	const metal_ = totals?.['metal_'] ?? 0;

	const data = {
		labels: ['Nylon Metallic', 'Nylon Plastic', 'Vislon', 'Metal'],
		datasets: [
			{
				label: '# of Products Produced',
				data: [nylon_metallic, nylon_plastic, vislon_, metal_],
				backgroundColor: [
					primaryColor,
					primaryColor,
					primaryColor,
					primaryColor,
				],
			},
		],
	};
	return (
		<BarChart title='Production' data={data}>
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
		</BarChart>
	);
}
