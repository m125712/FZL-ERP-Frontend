import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { bar_chart_options } from './utils';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export default function BarChart({ title, data, children }) {
	return (
		<div className='flex flex-col rounded-md bg-base-200 p-2 shadow-md'>
			<div className='flex items-center justify-between pl-1 pr-0.5'>
				<span className='text-xl font-semibold text-primary'>
					{title}
				</span>
				{children}
			</div>
			<Bar {...{ data, bar_chart_options }} />
		</div>
	);
}
