import numeral from 'numeral';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

import { useDashboardWorkInHand } from '../../query';

const chartConfig = {
	not_approved: {
		label: 'Not Approved',
		color: '#f31260',
	},
	approved: {
		label: 'Approved',
		color: '#00ADB5',
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
	const NUMBER_FORMATE = '0.00a';
	const { data, isLoading } = useDashboardWorkInHand();

	const chartData = data?.map((item) => ({
		...item,
		total: item.approved + item.not_approved,
	}));

	if (isLoading)
		return (
			<div className='skeleton aspect-auto h-[400px] w-full rounded-lg'></div>
		);

	const handelTooltip = (value, name, item, index) => {
		const { approved, not_approved } = item.payload;
		const total = numeral(approved + not_approved).format('0.00a');

		return (
			<>
				<div
					className='h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]'
					style={{
						'--color-bg': `var(--color-${name})`,
					}}
				/>
				{chartConfig[name]?.label || name}
				<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground'>
					{numeral(value).format(NUMBER_FORMATE)}
				</div>
				{index === 1 && (
					<div className='mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground'>
						Total
						<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground'>
							{total}
						</div>
					</div>
				)}
			</>
		);
	};

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<div>Production: Demand</div>
					<span className='live-indicator space-x-2'>
						<span className='live-dot'></span>
						<span className='live-text'> Live</span>
					</span>
				</CardTitle>
			</CardHeader>

			<CardContent>
				<ChartContainer
					className='aspect-auto h-[300px] w-full'
					config={chartConfig}
				>
					<BarChart data={chartData} layout='vertical'>
						<CartesianGrid />
						<YAxis dataKey='item_name' type='category' />
						<XAxis
							dataKey='total'
							type='number'
							tickFormatter={(value) =>
								numeral(value).format('0.0a')
							}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									formatter={(value, name, item, index) =>
										handelTooltip(value, name, item, index)
									}
								/>
							}
						/>
						<Bar
							dataKey='approved'
							stackId='a'
							fill='var(--color-approved)'
							radius={[0, 0, 0, 0]}
						>
							<LabelList
								dataKey='approved'
								position='center'
								className='fill-[--color-label]'
								fontSize={12}
								formatter={(value) =>
									numeral(value).format(NUMBER_FORMATE)
								}
							/>
						</Bar>
						<Bar
							dataKey='not_approved'
							stackId='a'
							fill='var(--color-not_approved)'
							radius={[0, 4, 4, 0]}
						>
							<LabelList
								dataKey='not_approved'
								position='center'
								className='fill-[--color-label]'
								fontSize={12}
								formatter={(value) =>
									numeral(value).format(NUMBER_FORMATE)
								}
							/>
							<LabelList
								dataKey='total'
								position='right'
								offset={8}
								className='fill-[--color-total]'
								fontSize={12}
								formatter={(value) =>
									numeral(value).format(NUMBER_FORMATE)
								}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
