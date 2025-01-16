import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartConfig = {
	views: {
		label: 'Qty',
	},
	zipper: {
		label: 'Zipper',
		color: '#27374D',
	},
	thread: {
		label: 'Thread',
		color: '#00ADB5',
	},
};
export function BarChartOverall(
	{ data } = {
		data: [],
	}
) {
	// var numeral = numeral();
	const [activeChart, setActiveChart] = useState('zipper');

	const total = useMemo(
		() => ({
			zipper: data?.reduce((acc, curr) => acc + curr.zipper, 0),
			thread: data?.reduce((acc, curr) => acc + curr.thread, 0),
		}),
		[data]
	);

	return (
		<Card>
			<CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
				<div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
					<CardTitle className='text-3xl'>Order Received</CardTitle>
				</div>
				<div className='flex'>
					{['zipper', 'thread'].map((key) => {
						const chart = key;
						return (
							<button
								key={chart}
								data-active={activeChart === chart}
								className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-primary/10 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
								onClick={() => setActiveChart(chart)}>
								<span className='text-xs text-primary'>
									{chartConfig[chart].label}
								</span>
								<span className='text-lg font-bold leading-none sm:text-3xl'>
									{numeral(total[key]).format('0.000a')}
								</span>
							</button>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className='px-2 sm:p-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'>
					<BarChart
						data={data}
						margin={{
							left: 12,
							right: 12,
						}}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) =>
								format(new Date(value), 'dd MMM')
							}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className='w-[150px]'
									nameKey='views'
									labelFormatter={(value) =>
										format(new Date(value), 'dd MMM, yy')
									}
									formatter={(value, name) => (
										<div className='flex min-w-[130px] items-center text-xs text-muted-foreground'>
											{chartConfig[name]?.label || name}
											<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
												{numeral(value).format('0a')}
											</div>
										</div>
									)}
								/>
							}
						/>
						<Bar
							dataKey={activeChart}
							fill={`var(--color-${activeChart})`}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
