'use client';

import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
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

const chartConfig = {
	total_quantity: {
		label: 'Total Quantity',
		color: '#4185f4',
	},
};
const daysMap = {
	yesterday: 1,
	last_seven_days: 7,
	last_fifteen_days: 15,
	last_thirty_days: 30,
};

export function BarChartVertical() {
	const [time, setTime] = useState('yesterday');

	let to = format(addDays(new Date(), -1), 'yyyy-MM-dd');
	let from = format(addDays(new Date(), -daysMap[time] || 1), 'yyyy-MM-dd');

	const { value: data } = useFetch(
		`/dashboard/production-status?start_date=${from}&end_date=${to}`,
		[from, to]
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Production Status</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<div className='flex items-center justify-between'>
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
					</div>
					<br />
					<BarChart
						accessibilityLayer
						data={data}
						margin={{
							top: 20,
						}}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='item_name'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey='total_quantity'
							fill='var(--color-total_quantity)'
							radius={8}>
							<LabelList
								position='insideTop'
								offset={12}
								className='fill-background'
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
