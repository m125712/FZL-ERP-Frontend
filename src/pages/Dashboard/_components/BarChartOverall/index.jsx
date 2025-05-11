import { useMemo, useState } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import numeral from 'numeral';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import Loader from '@/components/layout/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { ReactSelect } from '@/ui';

import { useDashboardOrderEntry } from '../../query';

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
	metal: {
		label: 'Metal',
		color: '#f31260',
	},
};

export function BarChartOverall() {
	const [from, setFrom] = useState(
		format(subDays(new Date(), 30), 'yyyy-MM-dd')
	);
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));

	const { data, isLoading, refetch, isFetching } = useDashboardOrderEntry(
		from,
		to
	);
	// var numeral = numeral();
	const [activeChart, setActiveChart] = useState('zipper');
	const [status, setStatus] = useState('30');
	const options = [
		{ value: 'all', label: 'All' },
		{ value: '30', label: '30 days' },
		{ value: '12', label: '12 months' },
	];

	const total = useMemo(
		() => ({
			zipper: data?.reduce((acc, curr) => acc + curr.zipper, 0),
			thread: data?.reduce((acc, curr) => acc + curr.thread, 0),
		}),
		[data, isLoading]
	);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<Card>
			<CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
				<div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 pr-10 sm:py-6'>
					<CardTitle className='flex items-center justify-between gap-4 text-3xl'>
						<div className='flex items-center gap-4'>
							Order Received{' '}
							<ReactSelect
								className='h-4 min-w-36 text-sm'
								placeholder='Select Status'
								options={options}
								value={options?.filter(
									(item) => item.value == status
								)}
								onChange={(e) => {
									setStatus(e.value);
									setTo(format(new Date(), 'yyyy-MM-dd'));
									if (e.value === '30') {
										setFrom(
											format(
												subDays(new Date(), 30),
												'yyyy-MM-dd'
											)
										);
									} else if (e.value === '12') {
										setFrom(
											format(
												subMonths(new Date(), 12),
												'yyyy-MM-dd'
											)
										);
									} else {
										setFrom('');
										setTo('');
									}
								}}
							/>
						</div>
					</CardTitle>
				</div>
				<div className='flex'>
					{['zipper', 'thread'].map((key) => {
						const chart = key;
						return (
							<button
								key={chart}
								data-active={activeChart === chart}
								className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-primary/10 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
								onClick={() => setActiveChart(chart)}
							>
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
					className='aspect-auto h-[250px] w-full'
				>
					<BarChart
						data={data}
						margin={{
							left: 12,
							right: 12,
						}}
					>
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
									labelFormatter={(value) => {
										if (
											value === 'Zipper' ||
											value === 'Thread'
										)
											return;

										return format(
											new Date(value),
											'dd MMM, yy'
										);
									}}
									formatter={(value, name, item) => {
										return (
											<div className='grid min-w-[130px] grid-cols-2 items-center text-xs text-muted-foreground'>
												{name === 'zipper' ? (
													<>
														<div>Nylon</div>
														<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
															{numeral(
																item.payload
																	.nylon
															).format('0a')}
														</div>
														<div>N-Plastic</div>
														<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
															{numeral(
																item.payload
																	.nylon_plastic
															).format('0a')}
														</div>
														<div>Metal</div>
														<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
															{numeral(
																item.payload
																	.metal
															).format('0a')}
														</div>
														<div>Vislon</div>
														<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
															{numeral(
																item.payload
																	.vislon
															).format('0a')}
														</div>
														<div>Total</div>
														<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
															{numeral(
																value
															).format('0a')}
														</div>
													</>
												) : (
													<>
														<div>
															{chartConfig[name]
																?.label || name}
														</div>
														<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
															{numeral(
																value
															).format('0a')}
														</div>
													</>
												)}
											</div>
										);
									}}
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
