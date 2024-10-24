'use client';

import { useState } from 'react';
import { RefreshCcw, TrendingUp } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
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
	amount: {
		label: 'Amount',
	},
	total_acceptance_due: {
		label: 'Total Acceptance Due:',
		color: '#4185f4',
	},
	total_maturity_due: {
		label: 'Total Maturity Due:',
		color: '#FF0000',
	},
	total_payment_due: {
		label: 'Total Payment Due',
		color: '#ffd965',
	},
};

export function PieChartDashboard() {
	const [status, setStatus] = useState(false);
	const { value: data, loading } = useFetch(`/dashboard/amount-percentage`, [
		status,
	]);
	const { value: data2, loading2 } = useFetch(`/dashboard/no-of-doc`, [
		status,
	]);

	if (loading || loading2) {
		return <span className='loading loading-dots loading-lg z-50' />;
	}

	if (!data || data.length === 0 || !data2 || data2.length === 0) {
		return <div>No data available</div>;
	}

	const mainChartData = data.map((item) => ({
		...item,
		amount: parseFloat(item.amount),
		fill: `var(--color-${item.name})`,
	}));

	const nestedChartData = data2.map((item) => ({
		...item,
		amount: item.amount,
		fill: `var(--color-${item.name})`,
	}));

	return (
		<Card className='flex flex-col'>
			<CardHeader className='flex items-center justify-between pb-0'>
				<CardTitle>Amount (USD) and # of Docs</CardTitle>
				<button
					type='button'
					className='btn-filter-outline'
					onClick={() => setStatus((prev) => !prev)}>
					<RefreshCcw className='size-4' />
				</button>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
					<ChartContainer
						config={chartConfig}
						className='aspect-square max-h-[300px] w-full md:w-2/3'>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent hideLabel />}
								/>
								<Pie
									data={mainChartData}
									dataKey='amount'
									nameKey='name'
									cx='50%'
									cy='50%'
									outerRadius={100}
									labelLine={false}
									label={({
										cx,
										cy,
										midAngle,
										innerRadius,
										outerRadius,
										value,
									}) => {
										const RADIAN = Math.PI / 180;
										const radius =
											innerRadius +
											(outerRadius - innerRadius) * 0.5;
										const x =
											cx +
											radius *
												Math.cos(-midAngle * RADIAN);
										const y =
											cy +
											radius *
												Math.sin(-midAngle * RADIAN);

										return (
											<text
												x={x}
												y={y}
												fill='white'
												textAnchor={
													x > cx ? 'start' : 'end'
												}
												dominantBaseline='central'
												className='text-xs font-medium'>
												{value.toFixed(1)}
											</text>
										);
									}}
								/>
								<ChartLegend
									content={
										<ChartLegendContent nameKey='name' />
									}
									className='mt-4 flex flex-wrap justify-center gap-2'
								/>
							</PieChart>
						</ResponsiveContainer>
					</ChartContainer>
					<ChartContainer
						config={chartConfig}
						className='aspect-square max-h-[200px] w-full md:w-1/3'>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<ChartTooltip
									content={<ChartTooltipContent hideLabel />}
								/>
								<Pie
									data={nestedChartData}
									dataKey='amount'
									nameKey='name'
									cx='50%'
									cy='50%'
									outerRadius={60}
									labelLine={false}
									label={({
										cx,
										cy,
										midAngle,
										innerRadius,
										outerRadius,
										value,
									}) => {
										const RADIAN = Math.PI / 180;
										const radius =
											innerRadius +
											(outerRadius - innerRadius) * 0.5;
										const x =
											cx +
											radius *
												Math.cos(-midAngle * RADIAN);
										const y =
											cy +
											radius *
												Math.sin(-midAngle * RADIAN);

										return (
											<text
												x={x}
												y={y}
												fill='white'
												textAnchor={
													x > cx ? 'start' : 'end'
												}
												dominantBaseline='central'
												className='text-[10px] font-medium'>
												{value}
											</text>
										);
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</ChartContainer>
				</div>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'></CardFooter>
		</Card>
	);
}
