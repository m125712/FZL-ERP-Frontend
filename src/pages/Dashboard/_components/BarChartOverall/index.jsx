import { useMemo, useState } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import numeral from 'numeral';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { ReactSelect } from '@/ui';

import { useDashboardOrderEntry } from '../../query';
import { LabelValue } from './components';
import { chartConfig, options } from './utils';

export const description = 'An interactive bar chart';

export function BarChartOverall() {
	const [from, setFrom] = useState(
		format(subDays(new Date(), 30), 'yyyy-MM-dd')
	);
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [activeChart, setActiveChart] = useState('zipper');
	const [status, setStatus] = useState('30');

	const { data, isLoading } = useDashboardOrderEntry(from, to);

	const total = useMemo(
		() => ({
			zipper: data?.reduce((acc, curr) => acc + curr.zipper, 0),
			thread: data?.reduce((acc, curr) => acc + curr.thread, 0),
		}),
		[data]
	);

	if (isLoading) {
		return (
			<div className='skeleton aspect-auto h-[400px] w-full rounded-lg border'></div>
		);
	}

	const handleDateChange = (e) => {
		const value = e.value;
		const FORMATE_DATE = 'yyyy-MM-dd';
		setStatus(value);

		let fromDate;
		switch (value) {
			case '30':
				fromDate = subDays(new Date(), 30);
				break;
			case '3':
			case '6':
			case '9':
			case '12':
				fromDate = subMonths(new Date(), parseInt(value));
				break;
			default:
				fromDate = null;
		}

		setFrom(fromDate ? format(fromDate, FORMATE_DATE) : '');
		setTo(format(new Date(), FORMATE_DATE));
	};

	return (
		<Card>
			<CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
				<div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 pr-10 sm:py-6'>
					<CardTitle className='flex items-center justify-between gap-4 text-3xl'>
						<div className='flex flex-col items-start gap-2'>
							<span>Order Received</span>
							<ReactSelect
								className='h-4 min-w-48 text-sm'
								placeholder='Select Status'
								options={options}
								value={options?.filter(
									(item) => item.value == status
								)}
								onChange={(e) => handleDateChange(e)}
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
											'EEE - dd MMM, yy'
										);
									}}
									formatter={(value, name, item) => {
										return (
											<div className='grid min-w-[130px] grid-cols-2 items-center text-xs text-muted-foreground'>
												{name === 'zipper' ? (
													<>
														<LabelValue
															label='Nylon'
															value={
																item.payload
																	.nylon
															}
														/>
														<LabelValue
															label='Nylon - P'
															value={
																item.payload
																	.nylon_plastic
															}
														/>
														<LabelValue
															label='Metal'
															value={
																item.payload
																	.metal
															}
														/>
														<LabelValue
															label='Vislon'
															value={
																item.payload
																	.vislon
															}
														/>
														<hr className='col-span-2 my-1 bg-primary' />
														<LabelValue
															label='Total'
															value={value}
														/>
													</>
												) : (
													<LabelValue
														label={
															chartConfig[name]
																?.label || name
														}
														value={value}
													/>
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
