import { useEffect, useMemo, useState } from 'react';
import { REPORT_DATE_FORMATE } from '@/pages/Report/utils';
import { useMaintenanceUtilityReport } from '@/state/Maintenance';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, ReactSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { getMonths, getYears } from './utils';

export default function Index() {
	const currentDate = new Date();
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [year, setYear] = useState(currentDate.getFullYear());

	const months = getMonths();
	const years = getYears(currentDate, 10);

	const query = `month=${month}&year=${year}`;
	const { data, url, isLoading } = useMaintenanceUtilityReport(query);

	const info = new PageInfo(
		'Maintenance / Utility Report',
		url,
		'maintenance__utility_report'
	);
	const haveAccess = useAccess('maintenance__utility_report');

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.date),
				id: 'date',
				header: 'Date',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} isTime={false} />;
				},
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'fzl_peak_hour')
						.current_reading,
				id: 'fzl_peak_hour_current_reading',
				header: 'FZL Pick',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'fzl_peak_hour')
						.reading_difference,
				id: 'fzl_peak_hour_reading_difference',
				header: 'Difference',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'fzl_peak_hour')
						.reading_cost,
				id: 'fzl_peak_hour_reading_cost',
				header: 'Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'fzl_off_hour')
						.current_reading,
				id: 'fzl_off_hour_current_reading',
				header: 'FZL Off Pick',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'fzl_off_hour')
						.reading_difference,
				id: 'fzl_off_hour_reading_difference',
				header: 'Difference',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'fzl_off_hour')
						.reading_cost,
				id: 'fzl_off_hour_reading_cost',
				header: 'Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					(
						row.entries.find(
							(entry) => entry.type === 'fzl_peak_hour'
						).reading_cost +
						row.entries.find(
							(entry) => entry.type === 'fzl_off_hour'
						).reading_cost
					).toFixed(2),
				id: 'fzl_total_cost',
				header: 'Total Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'boiler')
						.current_reading,
				id: 'boiler_current_reading',
				header: 'Boiler',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'boiler')
						.reading_difference,
				id: 'boiler_reading_difference',
				header: 'Difference',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'boiler')
						.reading_cost,
				id: 'boiler_reading_cost',
				header: 'Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'gas_generator')
						.current_reading,
				id: 'gas_generator_current_reading',
				header: 'Gas Generator',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'gas_generator')
						.reading_difference,
				id: 'gas_generator_reading_difference',
				header: 'Difference',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'gas_generator')
						.reading_cost,
				id: 'gas_generator_reading_cost',
				header: 'Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					(
						row.entries.find((entry) => entry.type === 'boiler')
							.reading_cost +
						row.entries.find(
							(entry) => entry.type === 'gas_generator'
						).reading_cost
					).toFixed(2),
				id: 'gas_total_cost',
				header: 'Total Gas',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'tsl_peak_hour')
						.current_reading,
				id: 'tsl_peak_hour_current_reading',
				header: 'TSL Peak',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'tsl_peak_hour')
						.reading_difference,
				id: 'tsl_peak_hour_reading_difference',
				header: 'Difference',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'tsl_peak_hour')
						.reading_cost,
				id: 'tsl_peak_hour_reading_cost',
				header: 'Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'tsl_off_hour')
						.current_reading,
				id: 'tsl_off_hour_current_reading',
				header: 'TSL Off Pick',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'tsl_off_hour')
						.reading_difference,
				id: 'tsl_off_hour_reading_difference',
				header: 'Difference',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.entries.find((entry) => entry.type === 'tsl_off_hour')
						.reading_cost,
				id: 'tsl_off_hour_reading_cost',
				header: 'Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					(
						row.entries.find(
							(entry) => entry.type === 'tsl_off_hour'
						).reading_cost +
						row.entries.find(
							(entry) => entry.type === 'tsl_peak_hour'
						).reading_cost
					).toFixed(2),
				id: 'tsl_total_cost',
				header: 'Total Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				showDateRange={false}
				accessor={haveAccess.includes('create')}
				extraButton={
					<div className='flex items-center gap-2'>
						<ReactSelect
							className='h-[2.34rem] w-32 text-sm'
							placeholder='Select Month'
							options={months}
							value={months.find((m) => m.value === month)}
							onChange={(e) => {
								setMonth(e.value);
							}}
						/>
						<ReactSelect
							className='h-[2.34rem] w-32 text-sm'
							placeholder='Select Year'
							options={years}
							value={years.find((y) => y.value === year)}
							onChange={(e) => {
								setYear(e.value);
							}}
						/>
					</div>
				}
			/>
		</div>
	);
}
