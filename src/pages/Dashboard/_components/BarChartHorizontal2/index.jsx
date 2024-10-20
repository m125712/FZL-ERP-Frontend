'use client';

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

const chartData = [
	{ item_name: 'January', approved: 186, not_approved: 80 },
	{ item_name: 'February', approved: 305, not_approved: 200 },
	{ item_name: 'March', approved: 237, not_approved: 120 },
	{ item_name: 'April', approved: 73, not_approved: 190 },
	{ item_name: 'May', approved: 209, not_approved: 130 },
	{ item_name: 'June', approved: 214, not_approved: 140 },
];

const chartConfig = {
	not_approved: {
		label: 'Not approved',
		color: 'hsl(var(--chart-1))',
	},
	approved: {
		label: 'Approved',
		color: 'hsl(var(--chart-2))',
	},
	total: {
		label: 'Total',
		color: 'hsl(var(--foreground))',
	},
	label: {
		color: 'hsl(var(--background))',
	},
};

export function BarChartHorizontal2(props) {
	const { value: data } = useFetch(`/dashboard/work-in-hand`);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Work in Hand</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<span className='live-indicator float-right'>
						(<span className='live-dot'></span>
						<span className='live-text'> Live</span>)
					</span>
					<BarChart
						accessibilityLayer
						data={data?.map((item) => ({
							...item,
							total: item.approved + item.not_approved,
						}))}
						layout='vertical'
						margin={{
							top: 5,
							right: 50,
							left: 5,
							bottom: 5,
						}}>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey='item_name'
							type='category'
							tickLine={true}
							tickMargin={10}
							axisLine={true}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<XAxis dataKey='total' type='number' />
						<ChartLegend content={<ChartLegendContent />} />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='line' />}
						/>
						<Bar
							dataKey='approved'
							stackId='a'
							fill='var(--color-approved)'
							radius={[0, 4, 4, 0]}>
							<LabelList
								dataKey='approved'
								position='center'
								className='fill-[--color-label]'
								fontSize={12}
							/>
							<LabelList
								dataKey='total'
								position='right'
								offset={8}
								className='fill-[--color-total]'
								fontSize={12}
							/>
						</Bar>
						<Bar
							dataKey='not_approved'
							stackId='a'
							fill='var(--color-not_approved)'
							radius={[4, 0, 0, 4]}>
							<LabelList
								dataKey='not_approved'
								position='center'
								className='fill-[--color-label]'
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'></CardFooter>
		</Card>
	);
}
