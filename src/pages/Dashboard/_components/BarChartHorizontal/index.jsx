'use client';

import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';
import { useFetch } from '@/hooks';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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

const chartConfig = {
	number_of_challan: {
		label: 'Number of Challan',
		color: 'hsl(var(--chart-1))',
	},
	amount: {
		label: 'Amount',
		color: 'hsl(var(--chart-2))',
	},
	label: {
		color: 'hsl(var(--background))',
	},
};

export function BarChartHorizontal(props) {
	const [time, setTime] = useState('yesterday');

	let to = format(addDays(new Date(), -1), 'yyyy-MM-dd');
	let from = format(addDays(new Date(), -daysMap[time] || 1), 'yyyy-MM-dd');

	const { value: data } = useFetch(
		props.time
			? `${props?.url}?start_date=${from}&end_date=${to}`
			: `${props?.url}`,
		[from, to]
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
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
								<option value='last_fifteen_days'>
									15 Days
								</option>
								<option value='last_thirty_days'>
									30 Days
								</option>
							</select>
						) : (
							<span className='live-indicator'>
								(<span className='live-dot'></span>
								<span className='live-text'> Live</span>)
							</span>
						)}
					</div>
					<br />
					<BarChart
						accessibilityLayer
						data={data?.chart_data}
						layout='vertical'
						margin={{
							right: 16,
						}}>
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
							dataKey='number_of_challan'
							fill='var(--color-number_of_challan)'
							radius={[4, 0, 0, 4]}>
							<LabelList
								dataKey='number_of_challan'
								position=''
								fill='var(--color-label)'
								fontSize={12}
							/>
						</Bar>
						<Bar
							dataKey='amount'
							fill='var(--color-amount)'
							radius={[0, 4, 4, 0]}>
							<LabelList
								dataKey='amount'
								position='insideRight'
								fill='var(--color-label)'
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
