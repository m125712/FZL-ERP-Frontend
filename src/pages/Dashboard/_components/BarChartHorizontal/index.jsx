'use client';

import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { RefreshCcw, TrendingUp } from 'lucide-react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';
import { useFetch } from '@/hooks';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const daysMap = {
	yesterday: 1,
	last_seven_days: 7,
	last_fifteen_days: 15,
	last_thirty_days: 30,
};

function capitalizeAndRemoveUnderscore(str) {
	return str
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function BarChartHorizontal(props) {
	const [time, setTime] = useState('yesterday');
	const [status, setStatus] = useState(false);

	let to = format(addDays(new Date(), -1), 'yyyy-MM-dd');
	let from = format(addDays(new Date(), -daysMap[time] || 1), 'yyyy-MM-dd');

	const chartConfig = {
		[props.label2]: {
			label: capitalizeAndRemoveUnderscore(props.label2),
			color: '#27374D',
		},
		[props.label1]: {
			label: capitalizeAndRemoveUnderscore(props.label1),
			color: '#00ADB5',
		},
		label: {
			color: 'hsl(var(--background))',
		},
	};

	const { value: data } = useFetch(
		props.time
			? `${props?.url}?start_date=${from}&end_date=${to}`
			: `${props?.url}`,
		[from, to, props.status]
	);

	return (
		<Card className='w-full'>
			<CardHeader className=''>
				<CardTitle className='flex items-center justify-between'>
					<div>
						{props.title} {props?.total && `#${data?.total_number}`}
					</div>
					<div className='flex items-center justify-between'>
						{props?.time ? (
							<select
								name='time'
								className='select select-secondary h-8 min-h-0 border-secondary/30 bg-base-200 transition-all duration-100 ease-in-out'
								value={time}
								onChange={(e) => setTime(e.target.value)}
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
							<span className='live-indicator space-x-2'>
								<span className='live-dot'></span>
								<span className='live-text'> Live</span>
							</span>
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={data?.chart_data}
						layout='vertical'
						margin={{
							right: 16,
						}}
					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey='item_name'
							type='category'
							tickLine={true}
							tickMargin={10}
							axisLine={true}
							tickFormatter={(value) => value}
						/>
						<XAxis type='number' />
						<ChartLegend content={<ChartLegendContent />} />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<Bar
							dataKey={props.label2}
							fill={chartConfig[props.label2].color}
							radius={[4, 0, 0, 4]}
						>
							<LabelList
								dataKey={props.label2}
								position='right'
								fill='black'
								fontSize={12}
							/>
						</Bar>
						<Bar
							dataKey={props.label1}
							fill={chartConfig[props.label1].color}
							radius={[0, 4, 4, 0]}
						>
							<LabelList
								dataKey={props.label1}
								position='right'
								fill='black'
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
